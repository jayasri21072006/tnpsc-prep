import base64
import io
import logging
import os
import platform
import subprocess

from livekit.agents import RunContext, function_tool
from livekit.agents.llm import ImageContent

logger = logging.getLogger("system_tools")


@function_tool
async def execute_system_command(context: RunContext, command: str) -> str:
    """Execute a PowerShell or Command Prompt command on the user's Windows system and return the output."""
    logger.info(f"Executing system command: {command}")
    try:
        proc = subprocess.run(
            ["powershell", "-NoProfile", "-Command", command],
            capture_output=True,
            text=True,
            timeout=15,
        )
        stdout = proc.stdout.strip()
        stderr = proc.stderr.strip()
        if stderr and not stdout:
            return f"Command error: {stderr}"
        return stdout if stdout else "Command executed successfully, Sir."
    except Exception as e:
        logger.error(f"Error executing system command '{command}': {e}")
        return f"Failed to execute command, Sir: {e}"


@function_tool
async def get_system_status(context: RunContext) -> str:
    """Get real-time computer status: CPU, RAM, OS version, disk storage, and battery."""
    try:
        ps_cmd = """
        $os = Get-CimInstance Win32_OperatingSystem
        $cpu = (Get-CimInstance Win32_Processor).LoadPercentage
        $totalRam = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
        $freeRam = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
        $usedRam = [math]::Round($totalRam - $freeRam, 1)
        $disk = Get-PSDrive C | Select-Object @{N='FreeGB';E={[math]::Round($_.Free/1GB,1)}}, @{N='UsedGB';E={[math]::Round($_.Used/1GB,1)}}
        "OS: Windows ($($os.Version)) | CPU Load: $cpu% | RAM: $usedRam GB / $totalRam GB | Drive C: Free $($disk.FreeGB) GB"
        """
        proc = subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps_cmd],
            capture_output=True,
            text=True,
            timeout=8,
        )
        return proc.stdout.strip() or f"System running on {platform.system()} {platform.release()}."
    except Exception as e:
        return f"Unable to fetch system stats, Sir: {e}"


@function_tool
async def control_volume(context: RunContext, action: str) -> str:
    """Control computer audio volume: 'mute', 'unmute', 'volume_up', 'volume_down'."""
    act = action.lower().strip()
    key_codes = {
        "mute": "(New-Object -ComObject WScript.Shell).SendKeys([char]173)",
        "unmute": "(New-Object -ComObject WScript.Shell).SendKeys([char]173)",
        "volume_up": "for($i=0;$i -lt 5;$i++){(New-Object -ComObject WScript.Shell).SendKeys([char]175)}",
        "volume_down": "for($i=0;$i -lt 5;$i++){(New-Object -ComObject WScript.Shell).SendKeys([char]174)}",
    }
    ps_cmd = key_codes.get(act, "(New-Object -ComObject WScript.Shell).SendKeys([char]173)")
    try:
        subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], timeout=5)
        return f"Audio volume adjusted ({action}), Sir."
    except Exception as e:
        return f"Could not adjust volume, Sir: {e}"


@function_tool
async def close_application(context: RunContext, app_name: str) -> str:
    """Terminate or close a running application or process (e.g. chrome, notepad, spotify, vlc, etc.)."""
    try:
        clean_name = app_name.replace(".exe", "").strip()
        cmd = f"Stop-Process -Name '{clean_name}' -Force -ErrorAction SilentlyContinue"
        subprocess.run(["powershell", "-NoProfile", "-Command", cmd], timeout=5)
        return f"Closed {app_name}, Sir."
    except Exception as e:
        return f"Could not close {app_name}, Sir: {e}"


@function_tool
async def lock_or_manage_pc(context: RunContext, action: str) -> str:
    """Manage PC power and security: 'lock', 'sleep', 'restart', 'shutdown'."""
    act = action.lower().strip()
    if act == "lock":
        subprocess.run(["rundll32.exe", "user32.dll,LockWorkStation"])
        return "Workstation locked, Sir."
    elif act == "sleep":
        subprocess.run(["powershell", "-NoProfile", "-Command", "rundll32.exe powrprof.dll,SetSuspendState 0,1,0"])
        return "Putting the computer to sleep, Sir."
    elif act == "restart":
        subprocess.run(["shutdown", "/r", "/t", "10"])
        return "Restarting the system in 10 seconds, Sir."
    elif act == "shutdown":
        subprocess.run(["shutdown", "/s", "/t", "10"])
        return "Shutting down the system in 10 seconds, Sir."
    return f"Action {action} acknowledged, Sir."
