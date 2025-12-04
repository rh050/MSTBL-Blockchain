# MSTBL Fresh Wallets Creation - Complete Process
# This script creates 4 wallets on the server and saves all keys locally

Write-Host "Creating 4 Fresh MSTBL Wallets on Server..." -ForegroundColor Cyan
Write-Host ""

$masterFile = "MSTBL_MASTER_KEYS.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Initialize master keys file
"MSTBL MASTER KEYS - FRESH BLOCKCHAIN" | Out-File -FilePath $masterFile -Encoding UTF8
"=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Generated: $timestamp" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Chain ID: mstbl-1" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"CRITICAL: This file contains ALL private keys!" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Keep SECURE and OFFLINE. NEVER commit to git." | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"" | Out-File -FilePath $masterFile -Encoding UTF8 -Append

# Function to create wallet on server
function Create-ServerWallet {
    param([string]$Name, [string]$Purpose, [string]$Balance)

    Write-Host "Creating: $Name..." -ForegroundColor Yellow

    # Create wallet on server
    $cmd = "docker exec mstbl-blockchain wasmd keys add $Name --keyring-backend test --output json"
    $output = gcloud compute ssh mstbl-node1 --command=$cmd 2>&1 | Select-String -Pattern '^\{' | Out-String

    $wallet = $output | ConvertFrom-Json
    $address = $wallet.address
    $mnemonic = $wallet.mnemonic

    Write-Host "  Address: $address" -ForegroundColor Green

    # Export private key
    $exportCmd = "docker exec mstbl-blockchain wasmd keys export $Name --keyring-backend test --unsafe --unarmored-hex"
    $privateKey = (gcloud compute ssh mstbl-node1 --command=$exportCmd 2>&1 | Select-String -NotMatch "zone" | Out-String).Trim()

    # Write to master file
    "" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "$($Name.ToUpper()) WALLET" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "Purpose: $Purpose" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "Expected Balance: $Balance MSTBL" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "Address:" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "$address" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "Mnemonic:" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "$mnemonic" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "Private Key (HEX):" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
    "$privateKey" | Out-File -FilePath $masterFile -Encoding UTF8 -Append

    Write-Host "  Saved!" -ForegroundColor Green
    Write-Host ""

    return @{
        Name = $Name
        Address = $address
        Mnemonic = $mnemonic
        PrivateKey = $privateKey
    }
}

# Create all 4 wallets
Write-Host "=" * 50 -ForegroundColor Cyan

$treasury = Create-ServerWallet -Name "treasury" -Purpose "Receives USDC payments" -Balance "849,999"
$sale = Create-ServerWallet -Name "sale" -Purpose "Sends MSTBL to customers" -Balance "250,000"
$validator = Create-ServerWallet -Name "validator" -Purpose "Contract admin and minter" -Balance "1"
$reserve = Create-ServerWallet -Name "reserve" -Purpose "Emergency reserve" -Balance "0"

# Add summary
"" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"QUICK REFERENCE" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Treasury:  $($treasury.Address)" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Sale:      $($sale.Address)" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Validator: $($validator.Address)" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Reserve:   $($reserve.Address)" | Out-File -FilePath $masterFile -Encoding UTF8 -Append

Write-Host "=" * 50 -ForegroundColor Green
Write-Host "SUCCESS: All 4 wallets created!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""
Write-Host "File: $masterFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "Addresses:" -ForegroundColor White
Write-Host "  Treasury:  $($treasury.Address)" -ForegroundColor White
Write-Host "  Sale:      $($sale.Address)" -ForegroundColor White
Write-Host "  Validator: $($validator.Address)" -ForegroundColor White
Write-Host "  Reserve:   $($reserve.Address)" -ForegroundColor White
Write-Host ""
Write-Host "CRITICAL: Backup $masterFile to secure location NOW!" -ForegroundColor Yellow
Write-Host ""
