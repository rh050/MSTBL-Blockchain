// 🎯 MSTBL Simple Treasury Service V2
// משתמש → USDC ל-Treasury → בדיקה ידנית → MSTBL מ-Sale Wallet

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MSTBL Treasury Service V2',
    timestamp: new Date().toISOString(),
    flow: 'User → USDC to Treasury → Manual verification → MSTBL from Sale',
    addresses: {
      treasury: process.env.TREASURY_ADDRESS || 'wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu',
      sale: 'wasm1rhj7ug3lvq2af559wu692jmjmwgnujuyy8f8fu'
    }
  });
});

// Purchase info endpoint
app.get('/purchase-info', (req, res) => {
  res.json({
    step1: 'Send USDC to Treasury wallet: wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu',
    step2: 'MSTBL tokens will be sent from Sale wallet after confirmation',
    step3: 'Current price phases: $1, $10, $100, $1000',
    note: 'Transactions are processed manually for security'
  });
});

// Live stats endpoint for frontend compatibility
app.get('/api/live-stats', (req, res) => {
  // Fixed price phases - Phase 1: $1.00
  res.json({
    currentStage: 1,
    stagePrice: 1.00,
    nextStagePrice: 10.00,
    tokensRemaining: 250000,
    totalSupply: 1000000,
    priceHistory: [
      { phase: 1, price: 1.00, sold: 0, remaining: 62500 },
      { phase: 2, price: 10.00, sold: 0, remaining: 62500 },
      { phase: 3, price: 100.00, sold: 0, remaining: 62500 },
      { phase: 4, price: 1000.00, sold: 0, remaining: 62500 }
    ]
  });
});

// Legacy endpoint for backward compatibility
app.get('/live-stats', (req, res) => {
  res.json({
    currentStage: 1,
    stagePrice: 1.00,
    nextStagePrice: 10.00,
    tokensRemaining: 250000,
    totalSupply: 1000000
  });
});

// Manual process endpoint for administrators
app.post('/process-purchase', (req, res) => {
  const { txHash, amount, userAddress, expectedMstbl } = req.body;

  console.log(`📥 Manual purchase processing request:`);
  console.log(`  TX Hash: ${txHash}`);
  console.log(`  Amount: ${amount} USDC`);
  console.log(`  User: ${userAddress}`);
  console.log(`  Expected MSTBL: ${expectedMstbl}`);

  // In a real implementation, this would:
  // 1. Verify the transaction exists on blockchain
  // 2. Check Treasury received USDC
  // 3. Calculate MSTBL amount based on current price
  // 4. Send MSTBL from Sale wallet to user

  res.json({
    success: true,
    message: 'Purchase request received for manual processing',
    data: { txHash, amount, userAddress, expectedMstbl }
  });
});

// Dynamic USDC balance check with required amount
app.post('/check-usdc-balance', (req, res) => {
  const { address, requiredAmount } = req.body;

  // Mock response - in production, query blockchain for actual USDC balance
  const currentBalance = "0"; // Would query actual balance from blockchain
  const required = parseFloat(requiredAmount || "0");
  const current = parseFloat(currentBalance);
  const hasEnough = current >= required;

  res.json({
    address: address,
    currentBalance: currentBalance,
    requiredAmount: requiredAmount,
    hasEnoughUsdc: hasEnough,
    insufficientFunds: !hasEnough ? {
      title: "Insufficient USDC Balance",
      message: `You currently have ${current} USDC but need ${required} USDC to complete this purchase.`,
      current: current.toString(),
      required: required.toString(),
      deficit: (required - current).toString(),
      action: "Get USDC",
      instructions: "Buy USDC on Osmosis DEX or use Keplr Wallet"
    } : null
  });
});// USDC purchase guide endpoint
app.get('/usdc-guide', (req, res) => {
  res.json({
    title: "How to get USDC for MSTBL purchase",
    subtitle: "Multiple ways to add USDC to your Keplr wallet:",
    methods: [
      {
        type: "DEX Purchase",
        title: "Buy USDC on Osmosis DEX",
        description: "Easiest way - Use Osmosis to swap other tokens for USDC",
        action: "Open Osmosis DEX",
        url: "https://app.osmosis.zone/",
        recommended: true
      },
      {
        type: "Keplr Wallet",
        title: "Use Keplr Wallet",
        description: "Open Keplr wallet and look for buy/swap options",
        action: "Open Keplr Wallet",
        url: "https://wallet.keplr.app/"
      },
      {
        type: "Bridge Transfer",
        title: "Bridge USDC from other networks",
        description: "Transfer USDC from Ethereum, Polygon, or other chains",
        services: ["Axelar Bridge", "Gravity Bridge", "IBC Bridge"]
      },
      {
        type: "Exchange",
        title: "Central Exchanges",
        description: "Buy USDC on centralized exchanges and withdraw to Cosmos",
        services: ["Binance", "Coinbase", "Kraken"]
      }
    ],
    important: "Make sure USDC is on the Cosmos/STBL network before attempting purchase"
  });
}); const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 MSTBL Simple Treasury Service V2 running on ${HOST}:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📊 Info: http://localhost:${PORT}/purchase-info`);
  console.log(`🏦 Treasury: ${process.env.TREASURY_ADDRESS || 'wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu'}`);
  console.log(`💎 Manual processing endpoint: POST /process-purchase`);
  console.log(`🌐 Cloud Run will map this to external port automatically`);
});

module.exports = app;
