# Shiksha Shield - Start Frontend
# Make sure backend is running first (start-backend.ps1)

Write-Host ""
Write-Host "  ====================================" -ForegroundColor Magenta
Write-Host "   SHIKSHA SHIELD - Frontend Server   " -ForegroundColor Magenta
Write-Host "  ====================================" -ForegroundColor Magenta
Write-Host ""

Set-Location "$PSScriptRoot\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "  [1/2] Installing npm packages..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "  Frontend starting at http://localhost:5173" -ForegroundColor Green
Write-Host ""

npm run dev
