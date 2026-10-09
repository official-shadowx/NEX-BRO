@echo off
title NEX BRO Portfolio - Dev Server
color 0A
echo ========================================
echo   NEX BRO Portfolio - Starting Server
echo ========================================
echo.
cd /d "%~dp0"
echo [*] Starting Next.js Development Server...
echo [*] Local:   http://localhost:3000
echo.
echo Press CTRL+C to stop the server.
echo.
npm run dev
pause
