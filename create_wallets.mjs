// MSTBL Fresh Wallets Creation - Pure JavaScript
// Creates 4 new Cosmos wallets locally and saves ALL keys

import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import fs from 'fs';

async function createWallet(name, purpose, expectedBalance) {
    console.log(`Creating: ${name}...`);

    // Generate new 24-word mnemonic wallet
    const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: 'wasm' });
    const [account] = await wallet.getAccounts();
    const mnemonic = wallet.mnemonic;

    // Get private key
    const privateKeyData = await wallet.getAccountsWithPrivkeys();
    const privateKeyHex = Buffer.from(privateKeyData[0].privkey).toString('hex');

    console.log(`  Address: ${account.address}`);
    console.log(`  ✅ Done!`);
    console.log('');

    return {
        name,
        purpose,
        expectedBalance,
        address: account.address,
        mnemonic,
        privateKeyHex
    };
}

async function main() {
    console.log('🔐 Creating 4 Fresh MSTBL Wallets...');
    console.log('');

    const wallets = [];

    // Create all 4 wallets
    wallets.push(await createWallet('treasury', 'Receives USDC payments', '849,999'));
    wallets.push(await createWallet('sale', 'Sends MSTBL to customers', '250,000'));
    wallets.push(await createWallet('validator', 'Contract admin and minter', '1'));
    wallets.push(await createWallet('reserve', 'Emergency reserve', '0'));

    // Create master keys file
    const timestamp = new Date().toISOString();
    let content = `${'='.repeat(70)}
   MSTBL MASTER KEYS - FRESH BLOCKCHAIN
${'='.repeat(70)}
Generated: ${timestamp}
Chain ID: mstbl-1
Bech32 Prefix: wasm

⚠️  CRITICAL SECURITY WARNING ⚠️
This file contains ALL private keys and mnemonics.
Keep SECURE and OFFLINE. NEVER commit to git.

${'='.repeat(70)}

`;

    // Add each wallet
    for (const w of wallets) {
        content += `
${'='.repeat(70)}
   ${w.name.toUpperCase()} WALLET
${'='.repeat(70)}
Purpose: ${w.purpose}
Expected Balance: ${w.expectedBalance} MSTBL

Address:
${w.address}

Mnemonic (24 words):
${w.mnemonic}

Private Key (HEX):
${w.privateKeyHex}

`;
    }

    // Add quick reference
    content += `
${'='.repeat(70)}
   QUICK REFERENCE
${'='.repeat(70)}

Treasury:  ${wallets[0].address}
Sale:      ${wallets[1].address}
Validator: ${wallets[2].address}
Reserve:   ${wallets[3].address}

${'='.repeat(70)}

`;

    // Save to file
    const filename = 'MSTBL_MASTER_KEYS.txt';
    fs.writeFileSync(filename, content, 'utf8');

    console.log('='.repeat(50));
    console.log('✅ All 4 wallets created successfully!');
    console.log('='.repeat(50));
    console.log('');
    console.log(`📄 All keys saved to: ${filename}`);
    console.log('');
    console.log('⚠️  CRITICAL: Backup this file immediately!');
    console.log('');
    console.log('📋 Wallet Addresses:');
    console.log(`   Treasury:  ${wallets[0].address}`);
    console.log(`   Sale:      ${wallets[1].address}`);
    console.log(`   Validator: ${wallets[2].address}`);
    console.log(`   Reserve:   ${wallets[3].address}`);
    console.log('');
}

main().catch(console.error);
