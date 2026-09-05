# Shiksha Shield - Start Backend
# Run this first, then start-frontend.ps1

Write-Host ""
Write-Host "  ====================================" -ForegroundColor Cyan
Write-Host "   SHIKSHA SHIELD - Backend Server    " -ForegroundColor Cyan
Write-Host "  ====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\backend"

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "  [1/2] Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "  [2/2] Installing dependencies..." -ForegroundColor Yellow
.\venv\Scripts\pip install -r requirements.txt --quiet

Write-Host ""
Write-Host "  Backend starting at http://localhost:8000" -ForegroundColor Green
Write-Host "  API docs at       http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

.\venv\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000 --reload
