# MSTBL (Million Stable Coin) - Production Ready

## 🚀 Live Production Services

### Frontend
- **Production URL**: https://app.mstbl.com
- **Cloud Run Service**: mstbl-prod-v1
- **Status**: ✅ Live and Running

### Backend API
- **Production URL**: https://api.stbl.mstbl.com
- **Cloud Run Service**: mstbl-backend
- **Status**: ✅ Live and Running

## 📁 Project Structure

```
.
├── frontend/           # Next.js frontend application
├── backend/           # Node.js backend service
├── stbld.exe         # STBL blockchain binary
├── .github/          # GitHub workflows
└── .vscode/          # VS Code configuration
```

## 🔧 Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
node simple-treasury-service.js
```

## 🌐 Production Deployment

Both services are deployed on Google Cloud Run and accessible via:
- Frontend: https://app.mstbl.com
- Backend API: https://api.stbl.mstbl.com

## 🔐 Environment Configuration

Production environment variables are configured in:
- `frontend/.env.production`
- Backend uses environment variables from Cloud Run

## 📚 API Endpoints

### Backend API
- `GET /health` - Service health check
- `GET /api/live-stats` - Live sale statistics
- `GET /purchase-info` - Purchase flow information

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: Node.js Express service
- **Deployment**: Google Cloud Run
- **DNS**: Cloudflare managed domains
- **Blockchain**: STBL chain integration

## 🚀 Treasury Purchase Flow

1. User sends USDC to Treasury wallet
2. Backend monitors Treasury transactions
3. MSTBL tokens sent automatically from Sale wallet
4. All transactions tracked and verified

---

**Status**: Production Ready ✅
**Last Updated**: October 22, 2025
