@echo off
rem ============================================================
rem  JARVIS quick launcher: starts the agent AND the React frontend
rem  in two separate console windows.
rem
rem  - Window 1 "javis-agent":    LiveKit agent worker (src/agent.py dev)
rem  - Window 2 "javis-frontend": Next.js dev server on http://localhost:3000
rem
rem  Leave both windows open while you use the app.
rem  Press Ctrl+C inside a window to stop that process.
rem ============================================================
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Installing Python dependencies with uv...
  uv sync
)

if not exist "frontend\node_modules\.bin\next.cmd" (
  echo Installing frontend dependencies with pnpm...
  cd frontend
  call pnpm install
  cd ..
)

start "javis-agent" cmd /k "cd /d %~dp0 && .venv\Scripts\python.exe src/agent.py dev"
start "javis-frontend" cmd /k "cd /d %~dp0frontend && pnpm dev"

echo.
echo JARVIS started in two new windows:
echo   agent   -> window "javis-agent"
echo   frontend-> window "javis-frontend"  (open http://localhost:3000)
echo.
echo Opening in Google Chrome...
start chrome http://localhost:3000