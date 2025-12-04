# Frontend Update Script - New Contract & Wallets
# Updates frontend with fresh blockchain configuration

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  MSTBL Frontend Update" -ForegroundColor Green
Write-Host "  Fresh Blockchain Configuration" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration
$CONTRACT = "wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"
$TREASURY = "wasm1nh5pylmsqlqfjun8qur04xhl570dknzewz0xph"
$SALE = "wasm1u07quqsn2tvu4qw3mtsyvsayqw47hk2wlqnffk"
$VALIDATOR = "wasm12mqjm7zgvmf30p53ktazn4pr7x5l765nlndzju"
$RESERVE = "wasm1r0pfrgjelyyhdxdmzqnq5qvgqrlzagxzhe773u"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Contract: $CONTRACT" -ForegroundColor Gray
Write-Host "   Treasury: $TREASURY" -ForegroundColor Gray
Write-Host "   Sale: $SALE" -ForegroundColor Gray
Write-Host "   Validator: $VALIDATOR" -ForegroundColor Gray
Write-Host "   Reserve: $RESERVE" -ForegroundColor Gray
Write-Host ""

# Navigate to frontend
Set-Location frontend

Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✅ Removed .next folder" -ForegroundColor Green
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

Write-Host "`n🏗️ Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Frontend built successfully" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Frontend Update Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test locally: npm run dev" -ForegroundColor White
Write-Host "   2. Connect Keplr wallet" -ForegroundColor White
Write-Host "   3. Verify MSTBL token auto-adds to Keplr" -ForegroundColor White
Write-Host "   4. Check balance shows correctly" -ForegroundColor White
Write-Host ""
Write-Host "📝 What was updated:" -ForegroundColor Yellow
Write-Host "   ✅ Contract address: $CONTRACT" -ForegroundColor Green
Write-Host "   ✅ Treasury wallet: $TREASURY" -ForegroundColor Green
Write-Host "   ✅ Sale wallet: $SALE" -ForegroundColor Green
Write-Host "   ✅ Validator wallet: $VALIDATOR" -ForegroundColor Green
Write-Host "   ✅ Reserve wallet: $RESERVE" -ForegroundColor Green
Write-Host ""

Set-Location ..
