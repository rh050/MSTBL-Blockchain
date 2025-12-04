# המלצות אבטחה - הגנה על המפתחות 🔒

## ⚠️ הסיכון הנוכחי

כרגע המפתחות נמצאים על השרת ב-keyring פשוט ללא הצפנה:

- **Treasury**: 849,999 MSTBL (77% מהאספקה)
- **Validator**: יכולת הטבעה בלתי מוגבלת
- **Keyring-backend: test** - אין סיסמה!

✅ **כל מי שמקבל גישה לשרת יכול לגנוב את המפתחות בקלות**

---

## 🎯 פתרון מומלץ: העבר ל-Cold Storage מיידית

### שלב 1: חלץ את המפתחות (עכשיו!)

```powershell
# התחבר לשרת
gcloud compute ssh mstbl-node1 --zone=us-central1-c

# חלץ את Treasury
sudo docker exec -it mstbl-blockchain wasmd keys export treasury \
  --keyring-backend test \
  --unsafe \
  --unarmored-hex > /tmp/treasury.key

# חלץ את Validator
sudo docker exec -it mstbl-blockchain wasmd keys export validator \
  --keyring-backend test \
  --unsafe \
  --unarmored-hex > /tmp/validator.key

# העתק למחשב המקומי
exit

# הורד את הקבצים
gcloud compute scp mstbl-node1:/tmp/treasury.key ./TREASURY_PRIVATE_KEY.txt --zone=us-central1-c
gcloud compute scp mstbl-node1:/tmp/validator.key ./VALIDATOR_PRIVATE_KEY.txt --zone=us-central1-c
```

### שלב 2: מחק מהשרת (חובה!)

```bash
# חזור לשרת
gcloud compute ssh mstbl-node1 --zone=us-central1-c

# מחק את הקבצים הזמניים
sudo rm /tmp/treasury.key /tmp/validator.key

# מחק את המפתחות מה-keyring
sudo docker exec -it mstbl-blockchain wasmd keys delete treasury --keyring-backend test --yes
sudo docker exec -it mstbl-blockchain wasmd keys delete validator --keyring-backend test --yes

# וודא שנמחקו
sudo docker exec mstbl-blockchain wasmd keys list --keyring-backend test
```

### שלב 3: אחסן בצורה מאובטחת

**אפשרויות אחסון מומלצות:**

1. **Hardware Wallet** (הכי בטוח)

   - Ledger / Trezor
   - לא מחובר לאינטרנט
   - דורש אישור פיזי לכל עסקה

2. **Password Manager** (טוב)

   - 1Password / Bitwarden / LastPass
   - מוצפן בסיסמה חזקה
   - 2FA מופעל
   - גיבוי מוצפן

3. **Paper Wallet** (בסיסי אבל בטוח)

   - כתוב על נייר
   - שמור בכספת
   - יצור 2-3 עותקים במקומות שונים
   - למינציה נגד מים/שריפה

4. **USB מוצפן** (בינוני)
   - USB עם הצפנת חומרה
   - שמור במקום פיזי בטוח
   - מנותק מהאינטרנט

**❌ אל תאחסן ב:**

- Google Drive / Dropbox (לא מוצפן מספיק)
- Email
- פתקים לא מאובטחים
- תמונות בטלפון
- קבצים לא מוצפנים במחשב

---

## 🔐 פתרון מתקדם: Hot Wallet + Cold Wallet

### ארכיטקטורה מומלצת:

```
┌─────────────────────────────────────────────┐
│  COLD STORAGE (Offline)                     │
│  ├─ Treasury (849,999 MSTBL) 🧊            │
│  └─ Validator (Admin + Minter) 🧊          │
└─────────────────────────────────────────────┘
                    ↓
            (העברות ידניות לפי צורך)
                    ↓
┌─────────────────────────────────────────────┐
│  HOT WALLET (On Server) 🔥                  │
│  └─ Sale (250,000 MSTBL) - למכירות        │
└─────────────────────────────────────────────┘
```

**היתרונות:**

- Treasury בטוח offline
- Sale Wallet יכול לעבוד אוטומטית
- כשנגמר Stock ב-Sale → העברה ידנית מ-Treasury

### הטמעה:

1. **השאר רק Sale Wallet על השרת**

   ```bash
   # רק המפתח הזה יישאר
   sudo docker exec mstbl-blockchain wasmd keys list --keyring-backend test
   # Output: sale, reserve (אם צריך)
   ```

2. **העבר Treasury ל-Cold Storage**

   - שמור ב-Hardware Wallet
   - רק תשתמש בו כשצריך למלא מחדש את Sale

3. **Validator ל-Emergency Cold Storage**
   - רק לשימוש חירום
   - לא צריך בכלל למכירות רגילות

---

## 🛡️ שכבות הגנה נוספות

### 1. שנה את Keyring ל-OS Backend (עם סיסמה)

במקום `test` השתמש ב-`os` עם הצפנה:

```bash
# יצירת מפתח חדש עם הצפנה
wasmd keys add sale-protected --keyring-backend os

# ייבוא מפתח קיים
wasmd keys import sale-protected sale.key --keyring-backend os
# (ידרוש סיסמה חזקה)
```

### 2. הגבל גישה לשרת

```bash
# רק IP ספציפי יכול להתחבר
# ערוך Google Cloud Firewall Rules:
gcloud compute firewall-rules create mstbl-ssh-restrict \
  --allow tcp:22 \
  --source-ranges YOUR_IP_ADDRESS/32 \
  --target-tags mstbl-node
```

### 3. 2FA לשרת

```bash
# התקן Google Authenticator
sudo apt-get install libpam-google-authenticator

# הפעל 2FA
google-authenticator
```

### 4. הפעל Audit Logging

```bash
# תעד כל גישה למפתחות
sudo apt-get install auditd
sudo auditctl -w /opt/mstbl-blockchain/keyring-test/ -p rwxa
```

### 5. Monitoring ו-Alerts

הוסף התראות אם:

- מישהו ניגש לקבצי keyring
- יש עסקה חשודה מ-Treasury
- יש ניסיון להטביע מטבעות חדשים

---

## 📋 Checklist אבטחה מיידי

- [ ] **חלץ Treasury מהשרת** (עדיפות גבוהה!)
- [ ] **חלץ Validator מהשרת** (עדיפות גבוהה!)
- [ ] **מחק את המפתחות מהשרת** (אחרי גיבוי!)
- [ ] **שמור ב-3 מקומות שונים ומאובטחים**
- [ ] **בדוק שהגיבויים עובדים** (נסה לשחזר)
- [ ] **הגבל גישת SSH לשרת**
- [ ] **הפעל 2FA**
- [ ] **שנה keyring-backend ל-os עם סיסמה** (למפתחות שנשארים)
- [ ] **תעד את כל הגישות**
- [ ] **הוסף monitoring**

---

## 🚨 מה לעשות אם השרת נפרץ

### תסריט חירום:

```bash
# 1. נתק מהאינטרנט מיידית
gcloud compute instances stop mstbl-node1 --zone=us-central1-c

# 2. בדוק את העסקאות האחרונות
# (מהמחשב המקומי שלך)
curl http://34.57.32.80:1317/cosmos/tx/v1beta1/txs?events=message.sender='wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu'

# 3. אם יש עסקאות חשודות - העבר מיידית לארנק חדש
# (השתמש ב-private key שגיבית)

# 4. צור keyring חדש עם הצפנה
```

### מספרי חירום:

- **Treasury Balance**: 849,999 MSTBL
- **Sale Balance**: 250,000 MSTBL
- **חשבון RPC**: http://34.57.32.80:26657

---

## 💡 המלצה סופית

**עשה עכשיו:**

1. ✅ חלץ את המפתחות לאחסון קר (10 דקות)
2. ✅ מחק מהשרת (2 דקות)
3. ✅ אחסן בצורה מאובטחת (5 דקות)

**אחר כך:**

- הוסף שכבות אבטחה לשרת
- הגדר monitoring
- תעד את הנהלים

**התוצאה:**

- 🔒 המפתחות שלך בטוחים offline
- 💰 849,999 MSTBL מוגנים
- 🚫 פורצים לא יכולים לגנוב
- ✅ אתה שולט על הכסף

---

_הערה: זה קריטי! ככל שהמפתחות על השרת זמן רב יותר, הסיכון גדל._
