@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo [1/1] Pushing main to origin (canonical + link fix commit)...
git push origin main
if errorlevel 1 (
  echo.
  echo FAILED: check VPN / proxy / GitHub access, then run this file again.
  pause
  exit /b 1
)
echo.
echo OK: GitHub updated. Cloudflare Pages should auto-build if each project is connected to this repo.
echo Next: open each Pages project and confirm the latest deployment uses commit 3689579c or newer.
pause
