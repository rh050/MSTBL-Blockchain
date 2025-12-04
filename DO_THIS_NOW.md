# 🎯 DO THIS NOW - STEP BY STEP

**Total Time**: ~15 minutes
**What You Do**: 2 manual GitHub clicks + 5 PowerShell commands

---

## ⚠️ STEP 1: FORK ON GITHUB (Manual - 1 Minute)

**IMPORTANT**: Do this in your browser FIRST

1. Open: https://github.com/chainapsis/keplr-chain-registry
2. Click the **"Fork"** button (top right corner)
3. Wait for it to complete (~30 seconds)
4. You'll see: "Your fork is ready" or similar

**Then come back here and run the commands below** ⬇️

---

## 🖥️ STEP 2-6: RUN THESE COMMANDS (Copy Each Exactly)

### Command 1: Clone Your Fork

**Copy and paste this entire block:**

```powershell
cd "c:\AppDevolpe\Million stable coin"
git clone https://github.com/rh050/keplr-chain-registry.git my-keplr-fork
cd my-keplr-fork
```

**Expected**: Downloads repository (takes ~1 minute)

---

### Command 2: Create Branch

**Copy and paste:**

```powershell
git checkout -b add/mstbl-million-stable-coin
```

**Expected**: `Switched to a new branch 'add/mstbl-million-stable-coin'`

---

### Command 3: Create Directory & Copy Files

**Copy and paste:**

```powershell
mkdir -p chains/mstbl
Copy-Item "c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\*" "chains/mstbl/" -Force
```

**Expected**: Files copied (takes ~5 seconds)

---

### Command 4: Verify Files

**Copy and paste:**

```powershell
Get-ChildItem chains/mstbl/
git status
```

**Expected**: See 3 files listed and git shows "Untracked files"

---

### Command 5: Commit Files

**Copy and paste entire block (it's one commit):**

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

**Expected**: Shows commit created successfully

---

### Command 6: Push to GitHub

**Copy and paste:**

```powershell
git push origin add/mstbl-million-stable-coin
```

**Expected**: Shows branch pushed to GitHub

---

## 🌐 STEP 7: CREATE PR ON GITHUB (Manual - 2 Minutes)

**Do this in your browser:**

1. Go to: https://github.com/rh050/keplr-chain-registry

2. Look for yellow banner: **"Compare & pull request"** - Click it

3. **Title** field: Copy this exactly:

```
Add MSTBL (Million Stable Coin) - mstbl-1 Chain Registry Entry
```

4. **Description** field: Scroll down and paste this:

```
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

5. Click **"Create pull request"** button

**🎉 DONE!** Your PR is submitted!

---

## ✅ VERIFICATION

After you submit the PR, check:

1. Go to: https://github.com/chainapsis/keplr-chain-registry/pulls
2. Look for your PR titled "Add MSTBL..."
3. Should show "Waiting for status checks"

**That's it!** Keplr team will review within 1-7 days.

---

## 🚨 ISSUES?

### If you get error: "repository not found"

- Make sure your fork exists: https://github.com/rh050/keplr-chain-registry
- Try the clone command again

### If git says "fatal: not a git repository"

- Make sure you're in the right directory:

```powershell
cd "c:\AppDevolpe\Million stable coin\my-keplr-fork"
```

### If files don't copy

- Check if directory exists:

```powershell
Test-Path "c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\"
```

---

**That's all you need to do! Follow the steps in order and you're good to go! 🚀**
