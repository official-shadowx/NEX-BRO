@echo off
title Push NEX BRO to GitHub
color 0A
echo ========================================
echo   Pushing NEX BRO to GitHub...
echo ========================================
echo.
cd /d "%~dp0"
git branch -M main
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================
    echo [*] SUCCESS! Uploaded to GitHub!
    echo [*] Check your repo: https://github.com/official-shadowx/NEX-BRO
    echo ========================================
) else (
    echo [!] Push incomplete. If browser opened, please complete login and run again.
)
echo.
pause
