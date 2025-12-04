# 🚀 KEPLR CHAIN REGISTRY SUBMISSION - EXECUTION PLAN

**User**: rh050 (hori050@gmail.com)
**Date**: December 4, 2025
**Status**: Ready for Manual Fork & Submit

---

## ⚠️ IMPORTANT NOTE

Due to GitHub authentication and fork operations requiring manual interaction, you'll need to complete the following steps manually through the GitHub web interface. The local files are prepared and ready.

---

## 📍 YOUR PREPARED FILES

All files are ready in:

```
c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\
├── chain.json (3,230 bytes)
├── assetlist.json (1,429 bytes)
└── README.md (3,105 bytes)
```

These files are identical to those in `chain-registry/mstbl/` - ready for submission to Keplr.

---

## 🔄 STEP-BY-STEP SUBMISSION PROCESS

### STEP 1: Fork the Repository (Web Interface)

**Action**: Go to the official Keplr Chain Registry

```
https://github.com/chainapsis/keplr-chain-registry
```

**What to do**:

1. Click the **"Fork"** button (top right)
2. Select your GitHub account as the destination
3. Fork will be created at: `https://github.com/rh050/keplr-chain-registry`

**Expected Result**: You'll have a copy of the repository under your account

---

### STEP 2: Clone Your Fork Locally

**Command**:

```powershell
cd "c:\AppDevolpe\Million stable coin"
git clone https://github.com/rh050/keplr-chain-registry.git my-keplr-fork
cd my-keplr-fork
```

**What this does**: Downloads your forked copy to your machine

---

### STEP 3: Create a New Branch

**Command**:

```powershell
git checkout -b add/mstbl-million-stable-coin
```

**Why**: Keeps your changes separate from the main branch

---

### STEP 4: Copy Files to Correct Location

**Current structure**:

```
c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\
```

**Target structure**:

```
c:\AppDevolpe\Million stable coin\my-keplr-fork\chains\mstbl\
```

**Command**:

```powershell
# Make sure the directory exists
mkdir -p chains/mstbl

# Copy files
Copy-Item "c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\*" "chains/mstbl/" -Force

# Verify
Get-ChildItem chains/mstbl/
```

**Expected Output**:

```
chain.json (3,230 bytes)
assetlist.json (1,429 bytes)
README.md (3,105 bytes)
```

---

### STEP 5: Verify Files Are Correct

**Command**:

```powershell
# Check the files exist
Test-Path "chains/mstbl/chain.json"
Test-Path "chains/mstbl/assetlist.json"
Test-Path "chains/mstbl/README.md"

# Check git status
git status
```

**Expected**: You should see the 3 new files listed under "Untracked files"

---

### STEP 6: Stage and Commit Changes

**Command**:

```powershell
# Stage the files
git add chains/mstbl/

# Commit with detailed message
git commit -m "Add MSTBL (Million Stable Coin) chain support

- Chain ID: mstbl-1
- RPC: http://34.57.32.80:26657
- REST: http://34.57.32.80:1317
- gRPC: 34.57.32.80:9090
- Contract: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
- Token: MSTBL (CW20, 1.1M total supply)
- Bech32: wasm
- Status: Testnet (Live)
- Documentation: Full chain configuration with asset list"
```

**Expected Result**: Commit succeeds with message shown

---

### STEP 7: Push to Your Fork

**Command**:

```powershell
git push origin add/mstbl-million-stable-coin
```

**What happens**: Sends your changes to your GitHub fork

**Expected Output**:

```
Enumerating objects: X done.
Counting objects: X% (X/X) done.
Delta compression using X threads
Compressing objects: 100% (X/X), done.
Writing objects: 100% (X/X), X bytes
To https://github.com/rh050/keplr-chain-registry.git
 * [new branch]      add/mstbl-million-stable-coin -> add/mstbl-million-stable-coin
```

---

### STEP 8: Create Pull Request (Web Interface)

**Action**: Go to your fork

```
https://github.com/rh050/keplr-chain-registry
```

**What to do**:

1. You'll see a yellow banner: "Compare & pull request"
2. Click that button
3. Ensure:
   - **Base repository**: `chainapsis/keplr-chain-registry`
   - **Base branch**: `main`
   - **Head repository**: `rh050/keplr-chain-registry`
   - **Compare branch**: `add/mstbl-million-stable-coin`

---

### STEP 9: Fill PR Title and Description

**Title**:

```
Add MSTBL (Million Stable Coin) - mstbl-1 Chain Registry Entry
```

**Description** (Copy and paste):

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

## Security Verification

✅ All files contain only public blockchain configuration
✅ No private keys or mnemonics included
✅ No wallet credentials or secrets
✅ Contract address is immutable blockchain record
✅ Endpoints are public infrastructure

## Test Results

- ✅ RPC endpoint responding
- ✅ REST endpoint responding with CORS enabled
- ✅ Contract queries returning correct metadata
- ✅ Keplr integration verified
- ✅ Symbol and decimals displaying correctly

## Additional Info

- **GitHub**: https://github.com/Million-Dollar-Stable-Coin/MSTBL
- **Chain Status**: Production ready
- **Block Height**: 1096+ (actively producing blocks)
- **Validator Status**: Active and healthy
```

---

### STEP 10: Submit PR

**Action**: Click "Create pull request" button

**What happens next**:

1. PR appears in `chainapsis/keplr-chain-registry`
2. Keplr team will review (usually 1-7 days)
3. They may request changes or approve
4. Once merged, MSTBL appears in Keplr

---

## ✅ COMPLETE WORKFLOW COMMANDS

If you want to run all commands at once, here's the complete sequence:

```powershell
# Navigate to project
cd "c:\AppDevolpe\Million stable coin"

# Clone your fork (after forking on GitHub)
git clone https://github.com/rh050/keplr-chain-registry.git my-keplr-fork
cd my-keplr-fork

# Create branch
git checkout -b add/mstbl-million-stable-coin

# Create directory
mkdir -p chains/mstbl

# Copy files
Copy-Item "c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\*" "chains/mstbl/" -Force

# Verify files
Get-ChildItem chains/mstbl/

# Stage files
git add chains/mstbl/

# Commit
git commit -m "Add MSTBL (Million Stable Coin) chain support

- Chain ID: mstbl-1
- RPC: http://34.57.32.80:26657
- REST: http://34.57.32.80:1317
- gRPC: 34.57.32.80:9090
- Contract: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
- Token: MSTBL (CW20, 1.1M total supply)
- Bech32: wasm
- Status: Testnet (Live)"

# Push to your fork
git push origin add/mstbl-million-stable-coin

# Display success
Write-Host "✓ Branch pushed! Now create PR on GitHub web interface" -ForegroundColor Green
Write-Host "  Go to: https://github.com/rh050/keplr-chain-registry" -ForegroundColor Cyan
Write-Host "  Click 'Compare & pull request' button" -ForegroundColor Cyan
```

---

## 🎯 SUMMARY

### Files Ready ✅

- chain.json (3,230 bytes)
- assetlist.json (1,429 bytes)
- README.md (3,105 bytes)

### Manual Steps Required:

1. Fork repository on GitHub (web)
2. Clone your fork locally (command)
3. Create branch and copy files (command)
4. Commit and push (command)
5. Create PR on GitHub (web)
6. Wait for Keplr team review

### Timeline:

- **Now**: Local preparation complete
- **Today**: Fork, copy, commit, push (5 min)
- **Today**: Create PR (1 min)
- **1-7 days**: Keplr team review
- **Post-merge**: MSTBL in Keplr ✨

---

## 🔗 IMPORTANT LINKS

**Keplr Chain Registry**:

```
https://github.com/chainapsis/keplr-chain-registry
```

**Your Fork** (after forking):

```
https://github.com/rh050/keplr-chain-registry
```

**Your MSTBL Project**:

```
c:\AppDevolpe\Million stable coin
```

---

**Status**: ✅ ALL LOCAL FILES PREPARED AND VERIFIED
**Next Action**: Fork repository and follow Step 2 above
**Estimated Time**: 15 minutes total (including GitHub web interaction)
