# ⚡ QUICK COMMAND REFERENCE - COPY & PASTE

**For**: Submitting MSTBL to Keplr Chain Registry
**User**: rh050 (hori050@gmail.com)
**Prepared Files**: Ready in `keplr-submission/chains/mstbl/`

---

## 🔴 STOP - DO THIS FIRST (One Time Only)

**1. Go to GitHub in your browser**

```
https://github.com/chainapsis/keplr-chain-registry
```

**2. Click the "Fork" button** (top right)

**3. Wait for it to complete** (takes ~30 seconds)

**Then come back and run the commands below** ⬇️

---

## ⚡ COPY-PASTE COMMANDS (Run These in Order)

### Command 1: Clone Your Fork

```powershell
cd "c:\AppDevolpe\Million stable coin"
git clone https://github.com/rh050/keplr-chain-registry.git my-keplr-fork
cd my-keplr-fork
```

### Command 2: Create Branch

```powershell
git checkout -b add/mstbl-million-stable-coin
```

### Command 3: Create Directory & Copy Files

```powershell
mkdir -p chains/mstbl
Copy-Item "c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\*" "chains/mstbl/" -Force
```

### Command 4: Verify Files

```powershell
Get-ChildItem chains/mstbl/
git status
```

**Expected Output**: 3 new files listed (chain.json, assetlist.json, README.md)

### Command 5: Stage Files

```powershell
git add chains/mstbl/
```

### Command 6: Commit Changes

```powershell
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

### Command 7: Push to GitHub

```powershell
git push origin add/mstbl-million-stable-coin
```

**Expected Output**:

```
 * [new branch]      add/mstbl-million-stable-coin -> add/mstbl-million-stable-coin
```

---

## 🌐 NOW DO THIS ON GITHUB (Web Browser)

**1. Go to your fork:**

```
https://github.com/rh050/keplr-chain-registry
```

**2. Look for the yellow banner**: "Compare & pull request"

**3. Click that button**

**4. Verify the setup:**

- Base: `chainapsis/keplr-chain-registry` → `main`
- Compare: `rh050/keplr-chain-registry` → `add/mstbl-million-stable-coin`

**5. Copy and paste this title:**

```
Add MSTBL (Million Stable Coin) - mstbl-1 Chain Registry Entry
```

**6. Scroll down to "Description" and paste this:**

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

**7. Click "Create pull request"** button at the bottom

**🎉 Done!** Your PR is submitted!

---

## ⏱️ TOTAL TIME ESTIMATE

| Step      | Action              | Time            |
| --------- | ------------------- | --------------- |
| 1         | Fork on GitHub      | 1 min           |
| 2-7       | Run Git commands    | 5 min           |
| 8-14      | Create PR on GitHub | 3 min           |
| **Total** | **Entire process**  | **~10 minutes** |

---

## ✅ VERIFICATION CHECKLIST

Before clicking "Create pull request", verify:

- [ ] Branch name visible: `add/mstbl-million-stable-coin`
- [ ] 3 files showing in "Files changed": chain.json, assetlist.json, README.md
- [ ] Title field filled: "Add MSTBL (Million Stable Coin)..."
- [ ] Description field filled with chain details
- [ ] Base is set to `chainapsis/keplr-chain-registry` → `main`

---

## 📞 IF SOMETHING GOES WRONG

### Issue: "File already exists"

```powershell
# Force overwrite
Copy-Item "c:\AppDevolpe\Million stable coin\keplr-submission\chains\mstbl\*" "chains/mstbl/" -Force
```

### Issue: "Git authentication failed"

```powershell
# Check your git config
git config user.name
git config user.email
# Should show: rh050 and hori050@gmail.com
```

### Issue: "Branch not found when pushing"

```powershell
# Create the branch locally first
git branch -vv
git push origin add/mstbl-million-stable-coin --set-upstream
```

### Issue: "Nothing to commit"

```powershell
# Check if files are staged
git status
# If files are listed as "Untracked", run:
git add chains/mstbl/
```

---

## 🎯 WHAT HAPPENS NEXT

1. **After PR submitted**: Keplr team reviews (1-7 days)
2. **If approved**: PR is merged into main repository
3. **After merge**: MSTBL appears in Keplr's supported chains
4. **Users can**: Search "MSTBL" in Keplr and add the chain

---

**Everything is prepared and ready. Just follow these commands in order!** ✨

Last updated: December 4, 2025
Status: ✅ READY FOR SUBMISSION
