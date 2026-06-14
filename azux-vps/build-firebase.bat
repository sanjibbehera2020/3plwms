@echo off
REM Firebase Hosting Build Script for Windows
REM This script builds the TanStack Start app and restructures it for Firebase static hosting

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo AZUX WMS - Firebase Hosting Build
echo ==========================================
echo.

REM Colors using echo with special characters (limited in Windows CMD)
REM Step 1: Clean old dist
echo [Step 1] Cleaning old build...
if exist dist (
    rmdir /s /q dist
    echo Removed old dist folder
)
echo.

REM Step 2: Build the app
echo [Step 2] Building application...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    exit /b 1
)
echo [SUCCESS] Build complete
echo.

REM Step 3: Restructure for Firebase
echo [Step 3] Restructuring for Firebase Hosting...

REM Copy client files to dist root
if exist dist\client (
    REM Copy all contents from client to dist
    for /d %%D in (dist\client\*) do (
        xcopy "%%D" "dist\%%~nxD\" /E /Y /I >nul 2>&1 || true
    )
    for %%F in (dist\client\*) do (
        copy "%%F" "dist\" >nul 2>&1 || true
    )
    
    REM Remove the client folder
    rmdir /s /q dist\client
    echo Copied client files to dist root
)

REM Remove server folder (not needed for static hosting)
if exist dist\server (
    rmdir /s /q dist\server
    echo Removed server folder
)

REM Copy index.html from public if not present
if not exist dist\index.html (
    if exist public\index.html (
        copy public\index.html dist\index.html >nul
        echo Added index.html entry point
    )
)

echo [SUCCESS] Restructured for Firebase Hosting
echo.

REM Step 4: Show build summary
echo [Build Summary]
dir /s dist | find "File(s)" 
echo.

REM Step 5: Firebase deployment option
echo [SUCCESS] Build ready for deployment!
echo.
echo To deploy to Firebase Hosting, run:
echo   firebase deploy --only hosting --project wms-3pl-app
echo.
echo Or deploy automatically:
echo   firebase deploy --only hosting --project wms-3pl-app ^&^& echo Deployed!
echo.

endlocal
