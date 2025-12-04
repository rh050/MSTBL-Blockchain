# MSTBL Frontend Deployment Script for Google Cloud Platform (PowerShell)
# This script deploys the MSTBL application to Google App Engine

Write-Host "🚀 MSTBL Frontend Deployment to Google Cloud Platform" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green

# Check if gcloud CLI is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to gcloud
$authList = gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>$null
if (-not $authList) {
    Write-Host "❌ Not logged in to gcloud. Please run: gcloud auth login" -ForegroundColor Red
    exit 1
}

# Get current project
$PROJECT_ID = gcloud config get-value project 2>$null
if (-not $PROJECT_ID) {
    Write-Host "❌ No project set. Please run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Using project: $PROJECT_ID" -ForegroundColor Cyan

# Verify we're in the correct directory
if (-not (Test-Path "package.json") -or -not (Test-Path "app.yaml")) {
    Write-Host "❌ Please run this script from the frontend directory containing package.json and app.yaml" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🏗️  Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "☁️  Deploying to Google App Engine..." -ForegroundColor Yellow
gcloud app deploy app.yaml --project=$PROJECT_ID --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your application is now available at:" -ForegroundColor Cyan
    Write-Host "   https://mstbl-frontend-dot-$PROJECT_ID.appspot.com" -ForegroundColor Blue
    Write-Host ""
    Write-Host "📋 To set up a custom domain:" -ForegroundColor Yellow
    Write-Host "   gcloud app domain-mappings create your-domain.com --certificate-management=AUTOMATIC" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎉 MSTBL Frontend successfully deployed with:" -ForegroundColor Green
    Write-Host "   ✅ Original MSTBL logo as favicon" -ForegroundColor Green
    Write-Host "   ✅ Keplr integration showing only CW20 MSTBL" -ForegroundColor Green
    Write-Host "   ✅ Production optimizations" -ForegroundColor Green
    Write-Host "   ✅ HTTPS enabled" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
