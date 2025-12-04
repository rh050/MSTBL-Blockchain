# MSTBL Frontend - Cloud Run Deployment Script
# This script updates the existing Cloud Run service with the new version

Write-Host "🚀 Updating MSTBL Frontend on Cloud Run" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$PROJECT_ID = "mstbl-472910"
$SERVICE_NAME = "mstbl-prod-v1"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/mstbl-frontend:latest"

Write-Host "📋 Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "📋 Service: $SERVICE_NAME" -ForegroundColor Cyan
Write-Host "📋 Region: $REGION" -ForegroundColor Cyan

# Build the Docker image
Write-Host "🔧 Building Docker image..." -ForegroundColor Yellow
docker build -t $IMAGE_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Push image to Google Container Registry
Write-Host "📤 Pushing image to GCR..." -ForegroundColor Yellow
docker push $IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker push failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host "☁️ Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image=$IMAGE_NAME `
    --platform=managed `
    --region=$REGION `
    --allow-unauthenticated `
    --port=3000 `
    --memory=512Mi `
    --cpu=1 `
    --min-instances=1 `
    --max-instances=10 `
    --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_CHAIN_ID=mstbl-1,NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.stbl.mstbl.com,NEXT_PUBLIC_REST_ENDPOINT=https://api.stbl.mstbl.com,NEXT_PUBLIC_MSTBL_CONTRACT=wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d,NEXT_PUBLIC_COIN_DENOM=mstbl"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Updated application is available at:" -ForegroundColor Cyan
    Write-Host "   https://mstbl-prod-v1-329336973316.us-central1.run.app" -ForegroundColor Blue
    Write-Host ""
    Write-Host "🎉 MSTBL Frontend updated with:" -ForegroundColor Green
    Write-Host "   ✅ Original MSTBL logo as favicon" -ForegroundColor Green
    Write-Host "   ✅ Keplr showing only CW20 MSTBL" -ForegroundColor Green
    Write-Host "   ✅ Latest production optimizations" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
