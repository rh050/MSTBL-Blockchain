# MSTBL - Million Stable Coin Blockchain

![MSTBL Logo](images/MSTBL_LOGO.png)

## 🌟 Overview

MSTBL (Million Stable Coin) is a Cosmos SDK-based blockchain built with CosmWasm smart contract support. The project features a CW20 token with a fixed supply of 1.1 million MSTBL tokens.

**Live Services:**

- 🌐 Website: [https://mstbl.com](https://mstbl.com)
- 🔗 RPC Endpoint: `https://rpc.stbl.mstbl.com`
- 📡 REST API: `https://api.stbl.mstbl.com`
- 💎 Chain ID: `mstbl-1`

## 📋 Key Features

- ✅ **Cosmos SDK 0.45.0** - Built on proven blockchain technology
- ✅ **CosmWasm 1.0.0** - Smart contract platform
- ✅ **CW20 Token** - Standardized token implementation
- ✅ **Fixed Supply** - 1,100,000 MSTBL (minting permanently disabled)
- ✅ **Keplr Integration** - Full wallet support
- ✅ **HTTPS Endpoints** - Secure APIs via Caddy reverse proxy
- ✅ **Next.js Frontend** - Modern web interface on Google Cloud Run

## 🏗️ Project Structure

```
MSTBL-Blockchain/
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── components/    # React components (Keplr, wallet UI)
│   │   ├── hooks/         # useKeplr hook for wallet integration
│   │   ├── pages/         # Next.js pages
│   │   └── types/         # TypeScript definitions
│   ├── public/            # Static assets, logos, videos
│   └── Dockerfile         # Container build configuration
├── backend/               # Node.js backend services
├── chain-registry/        # Keplr Chain Registry files
│   └── mstbl/
│       ├── chain.json     # Blockchain configuration
│       ├── assetlist.json # Token asset definitions
│       └── README.md      # Chain documentation
├── Caddyfile             # Reverse proxy config (HTTPS, CORS)
├── .github/              # GitHub Actions, Copilot instructions
└── cw20_base.wasm        # CW20 smart contract (deployed)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for deployment)
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/rh050/MSTBL-Blockchain.git
cd MSTBL-Blockchain

# Frontend setup
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### Environment Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=mstbl-1
NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.stbl.mstbl.com
NEXT_PUBLIC_REST_ENDPOINT=https://api.stbl.mstbl.com
NEXT_PUBLIC_BECH32_PREFIX=wasm
NEXT_PUBLIC_COIN_DENOM=mstbl
NEXT_PUBLIC_MSTBL_CONTRACT=wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
```

## 🔐 Smart Contract Details

**CW20 Token Contract:**

```
Address: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
Total Supply: 1,100,000 MSTBL (1,100,000,000,000 ustbl)
Decimals: 6
Minting: Disabled (immutable supply)
Standard: CW20 (CosmWasm)
```

**View on Explorer:**

```bash
# Query contract info
curl https://api.stbl.mstbl.com/cosmwasm/wasm/v1/contract/wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
```

## 🌐 Blockchain Specifications

| Property      | Value                 |
| ------------- | --------------------- |
| Chain ID      | `mstbl-1`             |
| Bech32 Prefix | `wasm`                |
| Coin Type     | 118 (Cosmos standard) |
| Block Time    | ~6 seconds            |
| Consensus     | Tendermint 0.34.0     |
| SDK Version   | Cosmos SDK 0.45.0     |
| WASM Version  | CosmWasm 1.0.0        |

**Public Endpoints:**

- RPC: `https://rpc.stbl.mstbl.com`
- REST: `https://api.stbl.mstbl.com`
- WebSocket: `wss://rpc.stbl.mstbl.com/websocket`
- gRPC: `34.57.32.80:9090`

## 🔗 Wallet Integration

### Keplr Wallet

MSTBL is fully integrated with Keplr Wallet:

1. Visit [https://mstbl.com](https://mstbl.com)
2. Click "Connect Wallet"
3. Approve network addition in Keplr popup
4. Start using MSTBL tokens

**Keplr Chain Registry:**

- PR Status: [#1344](https://github.com/chainapsis/keplr-chain-registry/pull/1344) (Open)
- Files: `chain.json`, `assetlist.json`, `README.md`

### Programmatic Connection

```typescript
// Using CosmJS
import { SigningStargateClient } from "@cosmjs/stargate";

const chainInfo = {
  chainId: "mstbl-1",
  chainName: "MSTBL Network",
  rpc: "https://rpc.stbl.mstbl.com",
  rest: "https://api.stbl.mstbl.com",
  // ... see chain-registry/mstbl/chain.json for full config
};

await window.keplr.experimentalSuggestChain(chainInfo);
await window.keplr.enable("mstbl-1");
```

## 📊 Tokenomics

- **Token Name:** MSTBL
- **Total Supply:** 1,100,000 MSTBL
- **Decimals:** 6 (1 MSTBL = 1,000,000 ustbl)
- **Type:** CW20 Token
- **Distribution:** Fully distributed, minting disabled
- **Use Cases:** Transactions, governance, staking

## 🛠️ Technology Stack

**Blockchain Layer:**

- Cosmos SDK 0.45.0
- Tendermint BFT Consensus 0.34.0
- CosmWasm 1.0.0
- CW20 Token Standard

**Frontend Stack:**

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- CosmJS / Keplr Wallet
- i18next (Multi-language support)

**Backend Services:**

- Node.js
- Express.js
- CosmJS Client

**Infrastructure:**

- **Cloud Provider:** Google Cloud Platform
- **Compute:** GCE e2-medium (us-central1-c)
- **Frontend Hosting:** Cloud Run
- **Reverse Proxy:** Caddy 2.10.2 (auto SSL)
- **DNS:** Cloudflare
- **SSL Certificates:** Let's Encrypt (auto-renewed)

## 🚀 Deployment

### Frontend Deployment (Cloud Run)

```bash
cd frontend
gcloud run deploy mstbl-prod-v1 \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Caddy Reverse Proxy

```bash
# SSH to server
gcloud compute ssh mstbl-node1 --zone us-central1-c

# Install Caddy
sudo caddy run --config /root/Caddyfile
```

**Caddyfile Configuration:**

- Automatic HTTPS (Let's Encrypt)
- CORS headers for all origins
- Path rewriting for Keplr compatibility
- Reverse proxy to localhost services

## 📝 Development Guide

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Cloud Run
gcloud run deploy mstbl-prod-v1 --source .
```

### Adding Features

1. **New Component:** Add to `frontend/src/components/`
2. **New Page:** Add to `frontend/src/pages/`
3. **Keplr Integration:** Modify `frontend/src/hooks/useKeplr.ts`
4. **Translations:** Update JSON files in `frontend/public/locales/`

### Testing Keplr Integration

```bash
# Test configuration endpoint
curl https://mstbl.com/api/debug-keplr-test

# Open debug page
open https://mstbl.com/debug
```

## 🔒 Security

**Best Practices:**

- ✅ No private keys or mnemonics in repository
- ✅ Environment variables for sensitive data
- ✅ `.gitignore` excludes all secrets
- ✅ HTTPS-only endpoints
- ✅ CORS configured for security
- ✅ Smart contract minting permanently disabled

**Files Excluded from Git:**

- `*.env` (environment variables)
- `*private*key*.txt` (private keys)
- `*mnemonic*.txt` (seed phrases)
- `*-keyring/` (blockchain keyrings)
- Build artifacts and logs

## 📖 Documentation

- [Chain Registry Submission](chain-registry/mstbl/README.md)
- [Frontend Deployment Guide](frontend/DEPLOYMENT_GUIDE.md)
- [Keplr Integration](frontend/src/hooks/useKeplr.ts)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) file for details

## 📧 Support & Contact

- 🌐 Website: [https://mstbl.com](https://mstbl.com)
- 📂 GitHub: [https://github.com/rh050/MSTBL-Blockchain](https://github.com/rh050/MSTBL-Blockchain)
- 🐦 Issues: [GitHub Issues](https://github.com/rh050/MSTBL-Blockchain/issues)

## 🙏 Acknowledgments

- Built on the [Cosmos SDK](https://github.com/cosmos/cosmos-sdk)
- Smart contracts powered by [CosmWasm](https://cosmwasm.com)
- Wallet integration via [Keplr](https://www.keplr.app)
- Frontend framework: [Next.js](https://nextjs.org)

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

**Built with ❤️ on the Cosmos ecosystem**
