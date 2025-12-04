# 🔄 KEPLR CHAIN REGISTRY PR - EXACT SUBMISSION STEPS

**User**: Million Stable Coin Development Team
**Target**: https://github.com/chainapsis/keplr-chain-registry
**PR Type**: New Chain Addition
**Chain**: MSTBL (mstbl-1)
**Files**: 3 (chain.json, assetlist.json, README.md)

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Fork the Repository

1. Go to: https://github.com/chainapsis/keplr-chain-registry
2. Click "Fork" button (top right)
3. Fork will be created at: https://github.com/YOUR_USERNAME/keplr-chain-registry

### Step 2: Clone Your Fork Locally

```powershell
git clone https://github.com/YOUR_USERNAME/keplr-chain-registry.git
cd keplr-chain-registry
```

### Step 3: Create New Branch

```powershell
git checkout -b add/mstbl-million-stable-coin
```

### Step 4: Create Directory Structure

```powershell
mkdir -p chains/mstbl
```

### Step 5: Copy Files from MSTBL Project

#### Copy chain.json

Source: `c:\AppDevolpe\Million stable coin\chain-registry\mstbl\chain.json`
Destination: `chains/mstbl/chain.json`

#### Copy assetlist.json

Source: `c:\AppDevolpe\Million stable coin\chain-registry\mstbl\assetlist.json`
Destination: `chains/mstbl/assetlist.json`

#### Copy README.md

Source: `c:\AppDevolpe\Million stable coin\chain-registry\mstbl\README.md`
Destination: `chains/mstbl/README.md`

### Step 6: Verify Files

```powershell
ls -la chains/mstbl/
# Should show:
# - chain.json (3,230 bytes)
# - assetlist.json (1,429 bytes)
# - README.md (3,105 bytes)
```

### Step 7: Add and Commit

```powershell
git add chains/mstbl/

git commit -m "Add MSTBL (Million Stable Coin) chain support

- Chain ID: mstbl-1
- RPC: http://34.57.32.80:26657
- REST: http://34.57.32.80:1317
- gRPC: 34.57.32.80:9090
- Contract: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
- Token: MSTBL (CW20, 1.1M total supply)
- Bech32: wasm
- Status: Testnet (Live)"
```

### Step 8: Push to Your Fork

```powershell
git push origin add/mstbl-million-stable-coin
```

### Step 9: Create Pull Request

1. Go to: https://github.com/YOUR_USERNAME/keplr-chain-registry
2. Click "Compare & pull request" button
3. Set:
   - **Base**: upstream/master
   - **Compare**: add/mstbl-million-stable-coin

### Step 10: Fill PR Description

**Title:**

```
Add MSTBL (Million Stable Coin) - mstbl-1 Chain Registry Entry
```

**Description:**

```markdown
## Chain Details

- **Chain ID**: mstbl-1
- **Network Type**: Testnet
- **Status**: Live
- **Consensus**: Tendermint v0.34.0
- **SDK**: Cosmos SDK v0.45.0
- **CosmWasm**: v1.0.0 (Enabled)

## Endpoints

- **RPC**: http://34.57.32.80:26657
- **REST**: http://34.57.32.80:1317
- **gRPC**: 34.57.32.80:9090

## Token Information

### Native Token (Stake)

- **Symbol**: STAKE
- **Decimals**: 6
- **Purpose**: Gas fees and validator staking

### MSTBL Token (CW20 Contract)

- **Contract Address**: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
- **Symbol**: MSTBL
- **Decimals**: 6
- **Name**: Million Stable Coin
- **Total Supply**: 1,100,000 MSTBL (fixed, immutable)
- **Minting**: Permanently disabled (minter = null)

## Files Included

- `chain.json` - Full chain configuration
- `assetlist.json` - Token definitions
- `README.md` - Documentation

## Security Notes

✅ All files contain only public blockchain configuration
✅ No private keys or mnemonics included
✅ No wallet credentials or secrets
✅ Contract address is immutable blockchain record
✅ Endpoints are public infrastructure

For security audit details, see: KEPLR_REGISTRY_SECURITY_AUDIT.md

## Test Results

- ✅ RPC endpoint responding
- ✅ REST endpoint responding with CORS enabled
- ✅ Contract queries returning correct metadata
- ✅ Keplr integration verified
- ✅ Symbol and decimals displaying correctly

## Repository

- GitHub: https://github.com/Million-Dollar-Stable-Coin/MSTBL

## Status

Ready for chain registry inclusion. All verification checks passed.
```

### Step 11: Submit PR

Click "Create pull request" button

### Step 12: Wait for Review

- Keplr maintainers will review the PR
- They may request changes
- Once approved and merged, MSTBL will appear in Keplr

---

## 🎯 WHAT HAPPENS AFTER MERGE

Once the PR is merged into the main repository:

1. **Users see MSTBL in Keplr**:

   - Click network selector
   - Search for "MSTBL"
   - Click "Add"

2. **Keplr automatically loads**:

   - Chain configuration from chain.json
   - Token metadata from assetlist.json
   - Sets up RPC, REST, and gRPC connections

3. **Users can**:
   - View STAKE balance (for gas)
   - View MSTBL balance
   - Query contracts
   - Send transactions

---

## 🔒 SECURITY REMINDER

### Files NOT Included in PR:

❌ MSTBL_MASTER_KEYS.txt (mnemonics)
❌ backend/.env (credentials)
❌ Wallet addresses with balances
❌ Private keys or secrets
❌ Deployment configuration

### Files in PR (Safe):

✅ chain.json (public configuration)
✅ assetlist.json (public metadata)
✅ README.md (documentation)

---

## 📞 TROUBLESHOOTING

### Issue: "Git credential helper not configured"

```powershell
# Configure GitHub credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Issue: "Permission denied" when pushing

```powershell
# Generate SSH key or use Personal Access Token
# See: https://docs.github.com/en/authentication
```

### Issue: "Base repository not found"

Ensure you're using the correct upstream:

```powershell
git remote add upstream https://github.com/chainapsis/keplr-chain-registry.git
git fetch upstream
```

---

## ✅ VERIFICATION CHECKLIST

Before submitting PR, verify:

- [ ] All 3 files copied to chains/mstbl/
- [ ] chain.json contains correct RPC endpoints
- [ ] assetlist.json contains correct contract address
- [ ] No .env files or secrets in the PR
- [ ] README.md is properly formatted
- [ ] Branch name is descriptive
- [ ] Commit message is clear
- [ ] PR description includes all details

---

## 📊 EXPECTED OUTCOME

### On Merge:

```
✅ Chain appears in Keplr's supported chains list
✅ Users can add mstbl-1 network
✅ Token metadata loads automatically
✅ RPC/REST/gRPC connections functional
✅ MSTBL token displays correctly
```

### User Experience:

```
1. Open Keplr → Network selector → Search "MSTBL" → Add
2. See STAKE and MSTBL tokens in wallet
3. View balances and send transactions
4. Query smart contracts
```

---

**Status**: ✅ READY FOR SUBMISSION
**Sensitivity**: 🟢 GREEN - No sensitive data
**Last Updated**: December 4, 2024
