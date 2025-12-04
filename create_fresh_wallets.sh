#!/bin/bash
# MSTBL Fresh Wallet Creation Script
# Creates 4 new wallets and saves ALL keys to MSTBL_MASTER_KEYS.txt

set -euo pipefail

echo "🔐 Creating Fresh MSTBL Wallets..."
echo ""

MASTER_FILE="MSTBL_MASTER_KEYS.txt"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Initialize master keys file
cat > "$MASTER_FILE" <<EOF
═══════════════════════════════════════════════════════════════
   MSTBL MASTER KEYS - FRESH BLOCKCHAIN
═══════════════════════════════════════════════════════════════
Generated: $TIMESTAMP
Chain ID: mstbl-1
Bech32 Prefix: wasm

⚠️  CRITICAL SECURITY WARNING ⚠️
This file contains ALL private keys and mnemonics.
Keep SECURE and OFFLINE. NEVER commit to git.

═══════════════════════════════════════════════════════════════

EOF

# Function to create wallet
create_wallet() {
    local NAME=$1
    local PURPOSE=$2
    local BALANCE=$3

    echo ">> Creating wallet: $NAME"

    # Generate wallet
    OUTPUT=$(wasmd keys add $NAME --keyring-backend test --output json 2>&1)
    ADDRESS=$(echo "$OUTPUT" | jq -r '.address')
    MNEMONIC=$(echo "$OUTPUT" | jq -r '.mnemonic')

    echo "   Address: $ADDRESS"

    # Export private key
    TEMP_KEY="temp_${NAME}.key"
    wasmd keys export $NAME --keyring-backend test --unsafe --unarmored-hex 2>&1 > "$TEMP_KEY"
    PRIVATE_KEY=$(cat "$TEMP_KEY" | tr -d '\n' | tr -d ' ')
    rm -f "$TEMP_KEY"

    # Write to master file
    cat >> "$MASTER_FILE" <<EOF

═══════════════════════════════════════════════════════════════
   $(echo $NAME | tr '[:lower:]' '[:upper:]') WALLET
═══════════════════════════════════════════════════════════════
Purpose: $PURPOSE
Expected Balance: $BALANCE MSTBL

Address:
$ADDRESS

Mnemonic:
$MNEMONIC

Private Key (HEX):
$PRIVATE_KEY

EOF

    echo "   ✅ Saved!"
    echo ""

    # Return values in array format
    echo "$NAME|$ADDRESS|$MNEMONIC|$PRIVATE_KEY"
}

# Create all 4 wallets
echo "════════════════════════════════════════════════"
echo "   Creating 4 MSTBL Production Wallets"
echo "════════════════════════════════════════════════"
echo ""

TREASURY=$(create_wallet "treasury" "Receives USDC payments" "849,999")
SALE=$(create_wallet "sale" "Sends MSTBL to customers" "250,000")
VALIDATOR=$(create_wallet "validator" "Contract admin and minter" "1")
RESERVE=$(create_wallet "reserve" "Emergency reserve" "0")

# Extract addresses
TREASURY_ADDR=$(echo "$TREASURY" | cut -d'|' -f2)
SALE_ADDR=$(echo "$SALE" | cut -d'|' -f2)
VALIDATOR_ADDR=$(echo "$VALIDATOR" | cut -d'|' -f2)
RESERVE_ADDR=$(echo "$RESERVE" | cut -d'|' -f2)

# Add summary
cat >> "$MASTER_FILE" <<EOF

═══════════════════════════════════════════════════════════════
   QUICK REFERENCE
═══════════════════════════════════════════════════════════════

Treasury:  $TREASURY_ADDR
Sale:      $SALE_ADDR
Validator: $VALIDATOR_ADDR
Reserve:   $RESERVE_ADDR

═══════════════════════════════════════════════════════════════

EOF

echo "════════════════════════════════════════════════"
echo "   ✅ All wallets created successfully!"
echo "════════════════════════════════════════════════"
echo ""
echo "📄 All keys saved to: $MASTER_FILE"
echo ""
echo "⚠️  CRITICAL: Backup this file immediately!"
echo ""
echo "📋 Wallet Addresses:"
echo "   Treasury:  $TREASURY_ADDR"
echo "   Sale:      $SALE_ADDR"
echo "   Validator: $VALIDATOR_ADDR"
echo "   Reserve:   $RESERVE_ADDR"
echo ""
