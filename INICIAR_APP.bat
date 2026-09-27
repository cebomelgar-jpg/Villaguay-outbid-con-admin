@echo off
title VILLAGUAY OUTBID - Iniciando aplicacion...
echo.
echo ========================================
echo   VILLAGUAY OUTBID
echo   Iniciando servidor de desarrollo...
echo ========================================
echo.

cd /d "%~dp0"

echo Instalando dependencias (si es necesario)...
call npm install
echo.

echo Iniciando servidor Next.js...
start cmd /k "npm run dev"

echo Esperando que el servidor inicie...
timeout /t 5 /nobreak >nul

echo Abriendo navegador en el Dev Hub...
start http://localhost:3000/dev-hub

echo.
echo ========================================
echo   Servidor iniciado correctamente
echo   El Dev Hub se abrira en tu navegador
echo   Presiona cualquier tecla para cerrar esta ventana
echo ========================================
echo.
pause >nul
