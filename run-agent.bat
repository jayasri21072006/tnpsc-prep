@echo off
title JARVIS Voice Agent Backend
cd /d "%~dp0"

echo ===================================================
echo   Starting JARVIS Voice Agent (LiveKit Backend)
echo ===================================================
echo.

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" src/agent.py dev
) else if exist "..\my-agent\.venv\Scripts\python.exe" (
    cd /d "..\my-agent"
    ".venv\Scripts\python.exe" src/agent.py dev
) else (
    echo Python virtual environment not found. Running with uv...
    uv run python src/agent.py dev
)

pause
