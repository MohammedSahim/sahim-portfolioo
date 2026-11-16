# Ensure working directory is the script folder even if launched as Administrator
if ($PSScriptRoot) {
    Set-Location $PSScriptRoot
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      Deploying Mohammed Sahim Portfolio to Vercel" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Current Directory: $((Get-Location).Path)" -ForegroundColor Gray
Write-Host ""

# Verify Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Installing globally via npm..." -ForegroundColor Yellow
    npm install -g vercel
}

# Login check
Write-Host "Step 1: Authenticating with Vercel..." -ForegroundColor Yellow
vercel login

# Deploy to production
Write-Host "`nStep 2: Deploying to Production..." -ForegroundColor Yellow
vercel --prod

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   Deployment Complete! Your site is live on Vercel." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
