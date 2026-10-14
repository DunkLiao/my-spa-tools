@echo off
setlocal EnableExtensions

set "OUT_DIR=%~dp0"
where curl.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: curl.exe was not found. Install a recent Windows version or add curl.exe to PATH.
    pause
    exit /b 1
)

call :download "tesseract.min.js" "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js" || goto :failed
call :download "worker.min.js" "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js" || goto :failed
call :download "tesseract-core-simd-lstm.wasm.js" "https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js" || goto :failed
call :download "chi_tra.traineddata" "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/chi_tra.traineddata" || goto :failed
call :download "eng.traineddata" "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata" || goto :failed

echo.
echo All OCR engine files were downloaded to:
echo %OUT_DIR%
echo Select all five files in the app's OCR Engine settings to import them.
pause
exit /b 0

:download
set "FILE_NAME=%~1"
set "FILE_URL=%~2"
set "TARGET=%OUT_DIR%%FILE_NAME%"
set "TEMP_FILE=%TARGET%.part"
echo Downloading %FILE_NAME%...
curl.exe --fail --location --retry 3 --retry-delay 2 --connect-timeout 30 --output "%TEMP_FILE%" "%FILE_URL%"
if errorlevel 1 (
    echo ERROR: Download failed for %FILE_NAME%.
    del /q "%TEMP_FILE%" >nul 2>&1
    exit /b 1
)
for %%F in ("%TEMP_FILE%") do if %%~zF LEQ 0 (
    echo ERROR: The downloaded file is empty: %FILE_NAME%.
    del /q "%TEMP_FILE%" >nul 2>&1
    exit /b 1
)
move /y "%TEMP_FILE%" "%TARGET%" >nul
if errorlevel 1 (
    echo ERROR: Could not save %FILE_NAME%.
    del /q "%TEMP_FILE%" >nul 2>&1
    exit /b 1
)
exit /b 0

:failed
echo.
echo Download stopped. Fix the error above and run this file again.
pause
exit /b 1
