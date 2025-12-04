# Keplr Chain Registry - Security Audit for MSTBL

**Date**: December 4, 2024
**Submitted Files**: chain.json, assetlist.json
**Target Repository**: https://github.com/chainapsis/keplr-chain-registry

## 🔒 Security Verification

### Files Included in PR (PUBLIC DATA ONLY)

✅ `chain.json` - Contains:

- Chain ID: `mstbl-1`
- Chain Name: `MSTBL`
- RPC Endpoint: `http://34.57.32.80:26657`
- REST Endpoint: `http://34.57.32.80:1317`
- gRPC Endpoint: `34.57.32.80:9090`
- Bech32 Prefix: `wasm`
- Gas configuration
- Consensus parameters (public blockchain configuration)

✅ `assetlist.json` - Contains:

- Token name: "Million Stable Coin"
- Token symbol: "MSTBL"
- Contract address: `wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d`
- Decimals: 6
- Base denomination: `stake` and `umstbl`
- **NO wallet addresses with balances**
- **NO private keys or mnemonics**

### Files EXCLUDED from PR (SENSITIVE DATA)

❌ `MSTBL_MASTER_KEYS.txt` - Contains all 4 wallet mnemonics (24-word recovery phrases)

- **Status**: Protected in `.gitignore`
- **Never committed to Git**: ✓ Verified
- **Location**: Local workstation only (offline storage)

❌ `backend/.env` - Contains:

- `SALE_WALLET_MNEMONIC`
- `TREASURY_MNEMONIC`
- `VALIDATOR_MNEMONIC`
- Wallet addresses with known balances
- **Status**: Protected in `.gitignore` pattern `backend/.env`
- **Never committed to Git**: ✓ Verified
- **Access**: Development environment only

❌ Contract deployment scripts (DELETED):

- `backend/deploy_contract.js` - ✅ Deleted (contained Validator mnemonic)
- `backend/disable_minting.js` - ✅ Deleted (contained Validator mnemonic)
- `backend/distribute_tokens.js` - ✅ Deleted (contained Validator mnemonic)
- `backend/create_fresh_wallets.js` - ✅ Deleted
- `init_fresh_blockchain.sh` - ✅ Deleted

❌ Configuration files NOT included:

- `config.toml` (contains blockchain validator setup)
- `app.toml` (contains blockchain validator setup)
- Docker compose files with server credentials
- Deployment infrastructure details

## Git Security Verification

### Commands Executed:

```powershell
# 1. Verified MSTBL_MASTER_KEYS.txt is in .gitignore
git check-ignore -v MSTBL_MASTER_KEYS.txt
# Result: ✅ Protected

# 2. Verified backend/.env is in .gitignore
git check-ignore -v backend/.env
# Result: ✅ Protected

# 3. Checked Git status for sensitive files
git status --porcelain | Select-String -Pattern "\.env|MASTER_KEYS"
# Result: ✅ Empty (no sensitive files staged)

# 4. Repository status
git log --oneline | Select-Object -First 15
# Result: Empty repository (no commits yet - safe for initial push)
```

### Git Ignore Configuration (.gitignore):

```
# Environment variables and secrets
.env
.env.*
*.env
backend/.env
backend/.env.*

# Private keys and sensitive data
*private*key*.txt
*mnemonic*.txt
*.hex
*secret*.txt
TREASURY_*.txt
VALIDATOR_*.txt

# Blockchain data
stbl/chain/data/
stbl/chain/.wasmd/
*.db

MSTBL_MASTER_KEYS.txt
```

## What's Public vs Private

### 📡 Public Information (Safe for Registry):

- Chain ID, Name, Status
- RPC, REST, gRPC endpoints (public infrastructure)
- Currency decimals and display names
- Contract address (immutable blockchain record)
- Gas settings and parameters
- Bech32 prefix (configuration)

### 🔐 Private Information (NOT in Registry):

- ❌ Wallet mnemonics or seed phrases
- ❌ Private keys in any format
- ❌ Wallet addresses with known balances
- ❌ Treasury, Sale, or Validator wallet details
- ❌ Deployment credentials or infrastructure
- ❌ Backend configuration

## Blockchain State on mstbl-1

### Contract Deployment (Safe Public Record):

- **Contract Address**: `wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d`
- **Code ID**: 1
- **Contract Type**: CW20 (Cosmos Wasm smart contract)
- **Total Supply**: 1,100,000 MSTBL (immutable)
- **Minting**: Permanently disabled (minter = null)
- **Transaction ID** (public blockchain record): 100DA478B69B1A4F18F5AE85E4BEC14FF2609B71473C14C986C105143A700911

### Wallet Distribution (Public Blockchain Record):

All transactions are immutable and recorded on the blockchain:

- **Treasury**: Received 849,999 MSTBL (Transaction: E7A5B24E3C48F114AFD6F2A1DB0523F25AAB5DE70D461867BBDD569F63E24ED3)
- **Sale**: Received 250,000 MSTBL
- **Validator**: Received 1 MSTBL
- **Reserve**: Received 0 MSTBL

✅ **Note**: These wallet addresses are blockchain public records (immutable ledger). The sensitive part is the recovery phrases stored offline in `MSTBL_MASTER_KEYS.txt`, which are NOT included in the registry.

## Recommendations

1. ✅ Safe to submit `chain.json` and `assetlist.json` to Keplr Chain Registry
2. ✅ All sensitive files are protected and never committed
3. ✅ Repository is fresh with no git history to sanitize
4. ✅ Wallet addresses appear only in blockchain transactions (public record)
5. 🔐 Keep `MSTBL_MASTER_KEYS.txt` offline and never share

## Timeline

- **Dec 3, 2024**: Fresh blockchain created, contract deployed, 1.1M MSTBL distributed
- **Dec 3, 2024**: Security cleanup - deleted all files with mnemonics
- **Dec 4, 2024**: CORS and REST API fixed for Keplr integration
- **Dec 4, 2024**: Chain registry PR files created and audited

---

**Status**: ✅ READY FOR SUBMISSION
**Security Level**: 🟢 HIGH - No sensitive data in submission
