# MSTBL Frontend - Contract Update Summary

## תאריך: 3 דצמבר 2025

---

## ✅ מה עודכן

### חוזה ה-CW20 החדש

**כתובת החוזה**: `wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d`

החוזה כבר היה נכון בכל קבצי ה-Frontend! 🎉

---

### ארנקים חדשים - עודכנו ב-.env

#### לפני (ארנקים ישנים):

```env
NEXT_PUBLIC_TREASURY_WALLET=wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu
NEXT_PUBLIC_SALE_WALLET=wasm1rhj7ug3lvq2af559wu692jmjmwgnujuyy8f8fu
NEXT_PUBLIC_VALIDATOR_WALLET=wasm124kmagjvv47pfjlsedyfnrcenly4zpydzlju3s
NEXT_PUBLIC_RESERVE_WALLET=wasm1g8grg0yw7asvgavp2vcvql7elzl3ugm04hhw6u
```

#### אחרי (ארנקים חדשים מ-MSTBL_MASTER_KEYS.txt):

```env
NEXT_PUBLIC_TREASURY_WALLET=wasm1nh5pylmsqlqfjun8qur04xhl570dknzewz0xph
NEXT_PUBLIC_SALE_WALLET=wasm1u07quqsn2tvu4qw3mtsyvsayqw47hk2wlqnffk
NEXT_PUBLIC_VALIDATOR_WALLET=wasm12mqjm7zgvmf30p53ktazn4pr7x5l765nlndzju
NEXT_PUBLIC_RESERVE_WALLET=wasm1r0pfrgjelyyhdxdmzqnq5qvgqrlzagxzhe773u
```

---

## 🔧 קבצים שעודכנו

1. ✅ **frontend/.env.production**

   - Treasury, Sale, Validator, Reserve addresses

2. ✅ **frontend/.env.local.production**
   - Treasury, Sale, Validator, Reserve addresses

---

## 🎯 פונקציונליות הוספת טוקן ל-Keplr

### הקוד הקיים ב-useKeplr.ts כבר מטפל בהכל!

```typescript
// Line 240-244 - מוסיף את הטוקן אוטומטית
const cw20ContractAddress = getEnvVar(
  "NEXT_PUBLIC_MSTBL_CONTRACT",
  "wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"
);

if (window.keplr.suggestToken) {
  await window.keplr.suggestToken(
    MSTBL_CHAIN_INFO.chainId,
    cw20ContractAddress
  );
}
```

### מה זה עושה:

1. 🔌 **כשמשתמש מתחבר לראשונה** - Keplr מוסיף את ה-MSTBL chain
2. 🪙 **מיד אחרי זה** - Keplr מציע להוסיף את טוקן MSTBL CW20
3. ✅ **המשתמש מאשר** - הטוקן מתוסף לארנק שלו ב-Keplr
4. 💰 **היתרה מוצגת** - המשתמש רואה את כמות ה-MSTBL שלו

---

## 🚀 איך לבדוק

### 1. הרץ Frontend לוקלית:

```powershell
cd frontend
npm run dev
```

### 2. פתח דפדפן:

```
http://localhost:3000
```

### 3. התחבר ל-Keplr:

- לחץ "Connect Wallet"
- Keplr ישאל: "Add MSTBL Network?" → אשר
- Keplr ישאל: "Add MSTBL Token?" → אשר
- הטוקן יופיע ב-Keplr שלך!

### 4. בדוק יתרה:

- פתח את Keplr extension
- בחר MSTBL Network
- תראה את יתרת ה-MSTBL שלך

---

## 📋 מה קורה מאחורי הקלעים

### תהליך החיבור:

1. **משתמש לוחץ "Connect Wallet"**

   ```typescript
   connectWallet() → useKeplr.ts
   ```

2. **Keplr מוסיף את ה-Chain**

   ```typescript
   window.keplr.experimentalSuggestChain(MSTBL_CHAIN_INFO);
   ```

   - Chain ID: mstbl-1
   - RPC: http://34.57.32.80:26657
   - REST: http://34.57.32.80:1317
   - Currencies: MSTBL (CW20), USDC

3. **Keplr מוסיף את הטוקן**

   ```typescript
   window.keplr.suggestToken(chainId, contractAddress);
   ```

   - Contract: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
   - Name: MSTBL
   - Symbol: MSTBL
   - Decimals: 6

4. **Frontend שואל את היתרה**

   ```typescript
   queryContractSmart(contractAddress, { balance: { address: userAddress } });
   ```

5. **מציג למשתמש**
   ```
   Balance: 250,000 MSTBL
   ```

---

## 🔒 אבטחה

- ✅ כל הכתובות נטענות מ-environment variables
- ✅ אין מפתחות פרטיים בקוד
- ✅ החוזה read-only (רק query, לא execute)
- ✅ Keplr מנהל את החתימה על טרנזקציות

---

## 📱 תמיכה במובייל

הקוד גם תומך ב-Keplr Mobile דרך Deep Links:

```typescript
KeplrMobileDeepLink.openKeplrApp(); // פותח את Keplr במובייל
```

---

## ✅ סטטוס

- [x] חוזה CW20 נכון בכל הקבצים
- [x] כתובות ארנקים עודכנו ב-.env
- [x] קוד הוספת טוקן קיים ופועל
- [x] תמיכה ב-Desktop + Mobile
- [x] Error handling למקרים קיצוניים

---

## 🎉 סיכום

**הכל מוכן! 🚀**

כשמשתמש יתחבר עם Keplr, הוא יראה:

1. בקשה להוסיף את MSTBL Network
2. בקשה להוסיף את MSTBL Token
3. היתרה שלו מוצגת אוטומטית

**לא צריך לעשות כלום נוסף!**

---

_עודכן: 3 דצמבר 2025_
