# MSTBL Frontend Deployment Package

## Files Included:
- Next.js optimized build in `.next/` directory
- Static assets in `public/` directory including **ORIGINAL MSTBL LOGO**
- Package configuration and dependencies
- Google Cloud Platform deployment configuration

## New Features Added:
✅ **Original MSTBL Logo Integration** - Using the authentic MSTBL_LOGO.png throughout the app
✅ **Keplr Integration Enhancement** - Now shows only CW20 MSTBL as primary currency
✅ **Optimized Build** - Production-ready with all dependencies
✅ **Favicon & Branding** - MSTBL logo displayed in browser tabs and Keplr wallet

## Logo Integration Details:
- **Browser Favicon**: Uses `/MSTBL_LOGO.png` and `/favicon.png`
- **Keplr Wallet**: Displays original MSTBL logo for CW20 tokens
- **App Icons**: Apple touch icon uses original logo
- **Consistent Branding**: Same logo across all platforms

## Quick Deployment to Google Cloud Platform:

### Option 1: PowerShell Script (Windows)
```powershell
.\deploy.ps1
```

### Option 2: Bash Script (Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 3: Manual Deployment Steps:

1. **Install gcloud CLI** (if not already installed):
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Login and set project**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Deploy application**:
   ```bash
   npm install
   npm run build
   gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
   ```

## Environment Variables (Already configured in app.yaml):
```env
NEXT_PUBLIC_CHAIN_ID=mstbl-1
NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.stbl.mstbl.com
NEXT_PUBLIC_REST_ENDPOINT=https://api.stbl.mstbl.com
NEXT_PUBLIC_MSTBL_CONTRACT=wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
NEXT_PUBLIC_COIN_DENOM=mstbl
NODE_ENV=production
```

## Features:
- ✅ Keplr wallet integration with CW20-first display
- ✅ **Original MSTBL logo branding** (favicon, app icon, Keplr display)
- ✅ Real-time blockchain data
- ✅ Multi-language support (English/Hebrew)
- ✅ Responsive design
- ✅ Error handling and user feedback
- ✅ Production optimization and HTTPS
- ✅ Auto-scaling on Google Cloud Platform

## Post-Deployment:
After successful deployment, your application will be available at:
`https://mstbl-frontend-dot-YOUR_PROJECT_ID.appspot.com`

Built with ❤️ for MSTBL Million Stable Coin Network
Using the **authentic MSTBL logo** throughout the application
