@echo off
rem Starts the miguisanson.dev autopilot minimised in its own window. Stop it with:
rem   type nul > .planning\AUTOPILOT_STOP
cd /d "%~dp0.."
start "miguisanson.dev autopilot" /min cmd /c "node scripts\autopilot.mjs >> logs\autopilot\console.log 2>&1"
