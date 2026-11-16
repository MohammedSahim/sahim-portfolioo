@echo off
:: Ensure working directory is always the script folder, even when run as Administrator
cd /d "%~dp0"

echo ========================================================
echo       Deploying Mohammed Sahim Portfolio to Vercel
echo ========================================================
echo Current Directory: %CD%
echo.

echo Step 1: Checking Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing globally via npm...
    npm install -g vercel
)

echo.
echo Step 2: Logging into Vercel...
echo (If you are already logged in, this will proceed automatically)
call vercel login

echo.
echo Step 3: Deploying project to Production...
call vercel --prod

echo.
echo ========================================================
echo    Deployment finished! Check the URL printed above.
echo ========================================================
pause
