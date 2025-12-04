# CORS Fix Instructions for MSTBL Blockchain

## הבעיה

Keplr מקבל שגיאה: "Failed to query response from the endpoints"

הסיבה: CORS (Cross-Origin Resource Sharing) מבוטל על השרת.

---

## הפתרון

### אופציה 1: תיקון ידני (מומלץ)

1. **התחבר לשרת:**

```bash
gcloud compute ssh mstbl-node1 --zone=us-central1-c
```

2. **ערוך את config.toml:**

```bash
nano /opt/wasmd_data/config/config.toml
```

3. **מצא את השורה:**

```
cors_allowed_origins = []
```

4. **שנה ל:**

```
cors_allowed_origins = ["*"]
```

5. **שמור (Ctrl+O, Enter, Ctrl+X)**

6. **הפעל מחדש את הקונטיינר:**

```bash
docker start mstbl-blockchain
```

7. **המתן 10 שניות ובדוק:**

```bash
sleep 10
docker logs --tail 20 mstbl-blockchain
```

8. **צא מהשרת:**

```bash
exit
```

---

### אופציה 2: Nginx Reverse Proxy עם SSL (ייצור)

זה הפתרון הנכון לייצור:

1. **התקן Nginx על השרת:**

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

2. **צור קובץ הגדרות:**

```bash
sudo nano /etc/nginx/sites-available/mstbl
```

3. **הוסף:**

```nginx
server {
    listen 80;
    server_name rpc.stbl.mstbl.com api.stbl.mstbl.com;

    # RPC endpoint
    location / {
        if ($host = rpc.stbl.mstbl.com) {
            proxy_pass http://localhost:26657;
        }
        if ($host = api.stbl.mstbl.com) {
            proxy_pass http://localhost:1317;
        }

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, X-Requested-With';

        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
```

4. **הפעל את ההגדרות:**

```bash
sudo ln -s /etc/nginx/sites-available/mstbl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **התקן SSL:**

```bash
sudo certbot --nginx -d rpc.stbl.mstbl.com -d api.stbl.mstbl.com
```

6. **עדכן DNS records:**

- `rpc.stbl.mstbl.com` → A record → `34.57.32.80`
- `api.stbl.mstbl.com` → A record → `34.57.32.80`

---

### אופציה 3: Google Cloud Load Balancer (מומלץ לייצור)

אם יש לך domain:

1. **צור Load Balancer עם SSL**
2. **הפנה ל-`34.57.32.80:26657` ו-`34.57.32.80:1317`**
3. **הגדר CORS headers**
4. **עדכן .env.production:**

```env
NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.stbl.mstbl.com
NEXT_PUBLIC_REST_ENDPOINT=https://api.stbl.mstbl.com
```

---

## בדיקה

### לאחר תיקון CORS:

```powershell
# מהמחשבון Windows:
Invoke-WebRequest -Uri "http://34.57.32.80:26657/status" -Method GET
```

אם עובד - אפשר להמשיך.

### בדיקת CORS מהדפדפן:

פתח Console בדפדפן והרץ:

```javascript
fetch("http://34.57.32.80:26657/status")
  .then((r) => r.json())
  .then((d) => console.log("✅ CORS works!", d))
  .catch((e) => console.error("❌ CORS blocked:", e));
```

אם רואה "✅ CORS works!" - מצוין!

---

## פתרון זמני (פיתוח מקומי)

אם CORS לא עובד, אפשר להריץ Frontend עם proxy:

1. **ערוך `frontend/package.json`:**

```json
{
  "proxy": "http://34.57.32.80:26657"
}
```

2. **או צור `frontend/next.config.js`:**

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/rpc/:path*",
        destination: "http://34.57.32.80:26657/:path*",
      },
      {
        source: "/api/rest/:path*",
        destination: "http://34.57.32.80:1317/:path*",
      },
    ];
  },
};
```

3. **עדכן .env.local:**

```env
NEXT_PUBLIC_RPC_ENDPOINT=http://localhost:3000/api/rpc
NEXT_PUBLIC_REST_ENDPOINT=http://localhost:3000/api/rest
```

---

## סיכום

**הפתרון המהיר (עכשיו):**

1. SSH לשרת
2. ערוך `/opt/wasmd_data/config/config.toml`
3. שנה `cors_allowed_origins = ["*"]`
4. `docker start mstbl-blockchain`

**הפתרון לייצור (מאוחר יותר):**

1. Nginx + Certbot + SSL
2. HTTPS endpoints
3. Domain names

---

_נוצר: 3 דצמבר 2025_
