# MSTBL Fresh Wallet Creation Script
# Creates 4 new wallets and saves ALL keys to MSTBL_MASTER_KEYS.txt

Write-Host "Creating Fresh MSTBL Wallets..." -ForegroundColor Cyan
Write-Host ""

$masterFile = "MSTBL_MASTER_KEYS.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Initialize master keys file
"MSTBL MASTER KEYS - FRESH BLOCKCHAIN" | Out-File -FilePath $masterFile -Encoding UTF8
"=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Generated: $timestamp" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Chain ID: mstbl-1" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Bech32 Prefix: wasm" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"CRITICAL SECURITY WARNING" | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"This file contains ALL private keys and mnemonics." | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"Keep SECURE and OFFLINE. NEVER commit to git." | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"=" * 70 | Out-File -FilePath $masterFile -Encoding UTF8 -Append
"" | Out-File -FilePath $masterFile -Encoding UTF8 -Append

# Function to create wallet
function Create-Wallet {
    param([string]$Name, [string]$Purpose, [string]$Balance)

    Write-Host "Creating: $Name" -ForegroundColor Yellow

    # Generate wallet
    $output = wasmd keys add $Name --keyring-backend test --output json 2>&1 | ConvertFrom-Json
    $address = $output.address
    $mnemonic = $output.mnemonic

    Write-Host "  Address: $address" -ForegroundColor Green

    # Export private key
    $keyFile = "temp_$Name.key"
    wasmd keys export $Name --keyring-backend test --unsafe --unarmored-hex 2>&1 | Out-File -FilePath $keyFile -Encoding ASCII
    $privateKey = (Get-Content $keyFile -Raw).Trim()
    Remove-Item $keyFile -Force

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
Write-Host "Creating 4 MSTBL Production Wallets" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

$treasury = Create-Wallet -Name "treasury" -Purpose "Receives USDC payments" -Balance "849,999"
$sale = Create-Wallet -Name "sale" -Purpose "Sends MSTBL to customers" -Balance "250,000"
$validator = Create-Wallet -Name "validator" -Purpose "Contract admin and minter" -Balance "1"
$reserve = Create-Wallet -Name "reserve" -Purpose "Emergency reserve" -Balance "0"

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
Write-Host "All wallets created successfully!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""
Write-Host "All keys saved to: $masterFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "CRITICAL: Backup this file immediately!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Wallet Addresses:" -ForegroundColor White
Write-Host "  Treasury:  $($treasury.Address)" -ForegroundColor White
Write-Host "  Sale:      $($sale.Address)" -ForegroundColor White
Write-Host "  Validator: $($validator.Address)" -ForegroundColor White
Write-Host "  Reserve:   $($reserve.Address)" -ForegroundColor White
Write-Host ""
