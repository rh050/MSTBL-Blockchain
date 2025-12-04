# 🔍 MSTBL Blockchain Wallet Audit Report

**Generated:** December 2, 2025
**Chain ID:** mstbl-1
**RPC:** http://34.57.32.80:26657
**Contract:** wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d

---

## ✅ **ACTIVE WALLETS (In Production)**

### 1. **Sale Wallet** - שולח MSTBL למשתמשים

- **Address:** `wasm1rhj7ug3lvq2af559wu692jmjmwgnujuyy8f8fu`
- **Balance:** 250,000 MSTBL (22.7% of supply)
- **Mnemonic:** ✅ FOUND in backend/.env
  ```
  arrest praise abuse upset crucial way embody bamboo awake blind volume tornado shadow link female jump dose salt hub govern pattern pulp neutral weekend
  ```
- **Purpose:** Sends MSTBL tokens to customers after USDC payment
- **Status:** 🟢 ACTIVE - Used by backend services

### 2. **Treasury Wallet** - מקבל USDC מהמשתמשים

- **Address:** `wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu`
- **Balance:** 849,999 MSTBL (77.3% of supply)
- **Mnemonic:** ❌ NOT FOUND in codebase
- **Purpose:** Receives USDC payments from customers
- **Status:** 🟢 ACTIVE - Used as payment destination
- **Note:** Mnemonic not needed for receiving payments

### 3. **Minter/Validator Wallet** - יכול ליצור טוקנים חדשים

- **Address:** `wasm124kmagjvv47pfjlsedyfnrcenly4zpydzlju3s`
- **Balance:** 1 MSTBL (0.0001% of supply)
- **Mnemonic:** ❌ NOT FOUND
- **Purpose:** Contract minter - can create new MSTBL tokens
- **Status:** 🟡 ACTIVE - Has minting permissions
- **Security:** No minting cap configured

---

## ❌ **INACTIVE WALLETS (Zero Balance)**

### 4. **Reserve Wallet** (from .env.production)

- **Address:** `wasm1g8grg0yw7asvgavp2vcvql7elzl3ugm04hhw6u`
- **Balance:** 0 MSTBL
- **Status:** 🔴 INACTIVE - Never used

### 5. **Doc Treasury** (from MSTBL_WALLETS_SECURE.txt)

- **Address:** `wasm18a47g3qfrknlyuwra02tr4n4g5dq6h2fq3ss7j`
- **Mnemonic:** hub river glow unit stem dynamic concert job...
- **Balance:** 0 MSTBL
- **Status:** 🔴 INACTIVE - Documentation only, never used

### 6. **Doc Marketing** (from MSTBL_WALLETS_SECURE.txt)

- **Address:** `wasm19fgsf2rrq455rfa3ru5kyxwhjdkfkyt6607ngd`
- **Mnemonic:** case steak weekend scorpion domain metal...
- **Balance:** 0 MSTBL
- **Status:** 🔴 INACTIVE - Documentation only, never used

### 7. **Doc Sale Admin** (from MSTBL_WALLETS_SECURE.txt)

- **Address:** `wasm10yn22389kzz0r5433m46s8qflep4uc7tae8k8m`
- **Mnemonic:** dog fiber reduce family alien van luggage...
- **Balance:** 0 MSTBL
- **Status:** 🔴 INACTIVE - Documentation only, never used

---

## 📊 **Token Distribution Summary**

| Wallet           | Address (Short) | Balance       | % of Supply | Status      |
| ---------------- | --------------- | ------------- | ----------- | ----------- |
| Treasury         | wasm14ye36...   | 849,999       | 77.3%       | 🟢 Active   |
| Sale             | wasm1rhj7u...   | 250,000       | 22.7%       | 🟢 Active   |
| Validator/Minter | wasm124kma...   | 1             | 0.0001%     | 🟡 Active   |
| Reserve          | wasm1g8grg...   | 0             | 0%          | 🔴 Inactive |
| Doc Treasury     | wasm18a47g...   | 0             | 0%          | 🔴 Inactive |
| Doc Marketing    | wasm19fgsf...   | 0             | 0%          | 🔴 Inactive |
| Doc Sale Admin   | wasm10yn22...   | 0             | 0%          | 🔴 Inactive |
| **TOTAL**        |                 | **1,100,000** | **100%**    |             |

---

## 🔐 **Mnemonic Status**

| Wallet           | Has Mnemonic | Location                 | Required?                   |
| ---------------- | ------------ | ------------------------ | --------------------------- |
| Sale Wallet      | ✅ YES       | backend/.env             | ✅ YES - Signs transactions |
| Treasury         | ❌ NO        | Not in code              | ❌ NO - Only receives       |
| Validator/Minter | ❌ NO        | Unknown                  | ⚠️ YES - For minting        |
| Reserve          | ❌ NO        | Unknown                  | ❌ NO - Unused              |
| Doc Wallets (3)  | ✅ YES       | MSTBL_WALLETS_SECURE.txt | ❌ NO - Unused              |

---

## ⚠️ **Security Concerns**

1. **Validator/Minter Wallet Unknown**

   - Has unlimited minting permissions
   - No cap configured on contract
   - Mnemonic not found in codebase
   - Could mint infinite MSTBL tokens

2. **Treasury Mnemonic Missing**

   - Has 77.3% of total supply (849,999 MSTBL)
   - If mnemonic is lost, tokens are locked forever
   - Recommend: Secure backup of mnemonic

3. **Outdated Documentation**
   - MSTBL_WALLETS_SECURE.txt contains wrong wallet addresses
   - Shows wallets that were never used on blockchain
   - Needs update with actual production addresses

---

## ✅ **Current Production Flow (Working)**

```
User → Sends USDC → Treasury (wasm14ye36...)
                          ↓
Backend monitors Treasury transactions
                          ↓
Backend → Sends MSTBL → Sale Wallet (wasm1rhj7u...) → User
```

**Mnemonic Required:** Only Sale Wallet (✅ Available in backend/.env)

---

## 🎯 **Recommendations**

1. **Update MSTBL_WALLETS_SECURE.txt**

   - Remove unused wallet addresses (wasm18a4..., wasm19fg..., wasm10yn...)
   - Add actual production addresses (wasm14ye36..., wasm1rhj7u...)
   - Document that only Sale Wallet needs mnemonic in code

2. **Secure Treasury Mnemonic**

   - Store Treasury mnemonic in secure offline location
   - Not needed in codebase (receive-only wallet)
   - Critical backup in case tokens need to be moved

3. **Investigate Validator/Minter Wallet**

   - Find mnemonic for wasm124kma...
   - Consider adding minting cap for security
   - Document minting permissions

4. **Clean Up Unused Wallets**
   - Remove Reserve wallet from .env.production if not needed
   - Archive documentation for unused wallets

---

## 📝 **Contract Information**

- **Total Supply:** 1,100,000 MSTBL (fixed)
- **Token Name:** MSTBL
- **Symbol:** MSTBL
- **Decimals:** 6
- **Minter:** wasm124kmagjvv47pfjlsedyfnrcenly4zpydzlju3s
- **Minting Cap:** None (unlimited)

---

**Status:** ✅ Production system working correctly with 2 active wallets
**Action Required:** Update documentation and secure Treasury mnemonic backup
