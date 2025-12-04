// 🎯 MSTBL Direct Treasury Purchase Service
// משתמש → USDC לTreasury → קבלת אישור → MSTBL מSale Wallet

const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { SigningStargateClient } = require('@cosmjs/stargate');
const { CosmWasmClient, SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');
const express = require('express');
const cors = require('cors');

class DirectTreasuryPurchaseService {
  constructor() {
    this.rpcEndpoint = process.env.RPC_ENDPOINT || 'http://34.57.32.80:26657';
    this.restEndpoint = process.env.REST_ENDPOINT || 'http://34.57.32.80:1317';

    // Sale Wallet מנפיק MSTBL tokens
    this.saleWalletMnemonic = process.env.SALE_WALLET_MNEMONIC ||
      "arrest praise abuse upset crucial way embody bamboo awake blind volume tornado shadow link female jump dose salt hub govern pattern pulp neutral weekend";

    // Treasury מקבל USDC payments
    this.treasuryAddress = process.env.TREASURY_ADDRESS || 'wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu';
    this.mstblContract = process.env.MSTBL_CONTRACT || 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d';

    // Service state
    this.processedTransactions = new Set();
    this.processedCount = 0;
    this.currentPhase = 1;
    this.tokensRemainingInPhase = 250000;

    // Sale phases
    this.salePhases = [
      { phase: 1, price: 1.00, maxTokens: 250000 },
      { phase: 2, price: 10.00, maxTokens: 250000 },
      { phase: 3, price: 100.00, maxTokens: 250000 },
      { phase: 4, price: 1000.00, maxTokens: 250000 }
    ];

    this.app = express();
    this.setupRoutes();
  }

  async initialize() {
    try {
      // Create sale wallet from mnemonic
      this.saleWallet = await DirectSecp256k1HdWallet.fromMnemonic(
        this.saleWalletMnemonic,
        { prefix: 'wasm' }
      );

      // Create signing client
      this.client = await SigningStargateClient.connectWithSigner(
        this.rpcEndpoint,
        this.saleWallet
      );

      // Create query client
      this.queryClient = await CosmWasmClient.connect(this.rpcEndpoint);

      const accounts = await this.saleWallet.getAccounts();
      this.saleAddress = accounts[0].address;

      console.log(`🚀 MSTBL Direct Treasury Service initialized`);
      console.log(`📧 Sale wallet: ${this.saleAddress}`);
      console.log(`🏦 Treasury (receives USDC): ${this.treasuryAddress}`);
      console.log(`💎 MSTBL contract: ${this.mstblContract}`);
      console.log(`🎯 Flow: User → USDC to Treasury → MSTBL from Sale`);

      return true;
    } catch (error) {
      console.error(`❌ Failed to initialize service:`, error);
      return false;
    }
  }

  setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'MSTBL Direct Treasury Purchase Service',
        currentPhase: this.currentPhase,
        tokensRemaining: this.tokensRemainingInPhase,
        currentPrice: this.getCurrentPhasePrice(),
        treasuryAddress: this.treasuryAddress,
        processedTransactions: this.processedCount,
        lastCheck: new Date(this.lastCheck).toISOString()
      });
    });

    // Get current purchase info
    this.app.get('/purchase-info', (req, res) => {
      const currentPrice = this.getCurrentPhasePrice();
      res.json({
        currentPhase: this.currentPhase,
        currentPrice: currentPrice,
        tokensRemaining: this.tokensRemainingInPhase,
        treasuryAddress: this.treasuryAddress,
        usdcDenom: 'uusdc', // או 'mstbl' לטסט
        phases: this.salePhases.map(phase => ({
          phase: phase.phase,
          price: phase.price,
          maxTokens: phase.maxTokens,
          status: phase.phase < this.currentPhase ? 'completed' :
            phase.phase === this.currentPhase ? 'active' : 'upcoming'
        }))
      });
    });

    // Manual transaction processing (for testing)
    this.app.post('/process-transaction', async (req, res) => {
      try {
        const { txHash, userAddress, usdcAmount } = req.body;

        if (!txHash || !userAddress || !usdcAmount) {
          return res.status(400).json({
            error: 'Missing required fields: txHash, userAddress, usdcAmount'
          });
        }

        console.log(`🔧 Manual processing: ${txHash}`);
        const result = await this.processPurchase({
          txHash,
          userAddress,
          usdcAmount: parseFloat(usdcAmount)
        });

        res.json({ success: true, result });
      } catch (error) {
        console.error('Manual processing failed:', error);
        res.status(500).json({
          error: error.message || 'Processing failed'
        });
      }
    });
  }

  getCurrentPhasePrice() {
    const phase = this.salePhases.find(p => p.phase === this.currentPhase);
    return phase ? phase.price : 1000.00;
  }

  // ✅ עיבוד רכישה - הלוגיקה החדשה
  async processPurchase({ txHash, userAddress, usdcAmount }) {
    try {
      console.log(`\n💰 Processing purchase:`);
      console.log(`📧 User: ${userAddress}`);
      console.log(`💵 USDC Amount: ${usdcAmount}`);
      console.log(`🔗 TX Hash: ${txHash}`);

      // בדיקה שהטרנזקציה לא עובדה כבר
      if (this.processedTransactions.has(txHash)) {
        console.log(`⚠️ Transaction already processed: ${txHash}`);
        return { status: 'already_processed', txHash };
      }

      // חישוב כמות MSTBL
      const currentPrice = this.getCurrentPhasePrice();
      const mstblAmount = Math.floor((usdcAmount / currentPrice) * 1_000_000); // micro-MSTBL
      const mstblDisplay = (mstblAmount / 1_000_000).toFixed(6);

      console.log(`💎 MSTBL to send: ${mstblDisplay} (${mstblAmount} micro-MSTBL)`);
      console.log(`📈 Current price: $${currentPrice}`);

      // בדיקה שיש מספיק tokens בשלב הנוכחי
      if (mstblAmount > this.tokensRemainingInPhase * 1_000_000) {
        console.log(`⚠️ Not enough tokens in current phase`);
        return {
          status: 'insufficient_tokens',
          available: this.tokensRemainingInPhase,
          requested: mstblAmount / 1_000_000
        };
      }

      // 🚀 שליחת MSTBL מSale Wallet למשתמש
      console.log(`📤 Sending MSTBL from Sale Wallet to user...`);
      const mstblTransferMsg = {
        transfer: {
          recipient: userAddress,
          amount: mstblAmount.toString()
        }
      };

      const executeMsg = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
          sender: this.saleAddress,
          contract: this.mstblContract,
          msg: Buffer.from(JSON.stringify(mstblTransferMsg)),
          funds: []
        }
      };

      const mstblTransferResult = await this.client.signAndBroadcast(
        this.saleAddress,
        [executeMsg],
        {
          amount: [{ denom: 'mstbl', amount: '5000' }],
          gas: '300000'
        },
        `MSTBL delivery for USDC purchase - TX: ${txHash}`
      );

      console.log(`✅ MSTBL transfer completed: ${mstblTransferResult.transactionHash}`);

      // עדכון מצב שלב
      this.tokensRemainingInPhase -= (mstblAmount / 1_000_000);

      // בדיקה אם השלב הסתיים
      if (this.tokensRemainingInPhase <= 0) {
        this.currentPhase++;
        this.tokensRemainingInPhase = 250000;
        console.log(`🎯 Phase ${this.currentPhase - 1} completed! Moving to Phase ${this.currentPhase}`);
      }

      console.log(`📊 Tokens remaining in Phase ${this.currentPhase}: ${this.tokensRemainingInPhase}`);

      // רישום הטרנזקציה כמעובדת
      this.processedTransactions.add(txHash);
      this.processedCount++;

      // לוג הצלחה
      console.log(`\n🎉 PURCHASE COMPLETED:`);
      console.log(`👤 Buyer: ${userAddress}`);
      console.log(`💵 Paid: ${usdcAmount} USDC to Treasury`);
      console.log(`💎 Received: ${mstblDisplay} MSTBL from Sale Wallet`);
      console.log(`💎 MSTBL TX: ${mstblTransferResult.transactionHash}`);

      return {
        status: 'completed',
        txHash,
        userAddress,
        usdcAmount,
        mstblAmount: parseFloat(mstblDisplay),
        mstblTxHash: mstblTransferResult.transactionHash,
        currentPhase: this.currentPhase,
        tokensRemaining: this.tokensRemainingInPhase
      };

    } catch (error) {
      console.error(`❌ Failed to process purchase:`, error);
      throw error;
    }
  }

  // ✅ מעקב אחר Treasury לקבלת תשלומי USDC
  async checkTreasuryTransactions() {
    try {
      // שאילתת REST API - רק טרנזקציות לTreasury
      const query = `events=transfer.recipient=${this.treasuryAddress}&order_by=ORDER_BY_DESC&limit=10`;
      const url = `${this.restEndpoint}/cosmos/tx/v1beta1/txs?${query}`;

      console.log(`🔍 Checking Treasury transactions: ${this.treasuryAddress}`);

      const response = await fetch(url, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Treasury query failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.txs && data.txs.length > 0) {
        console.log(`📋 Found ${data.txs.length} recent Treasury transactions`);

        for (const tx of data.txs) {
          if (!this.processedTransactions.has(tx.txhash)) {
            await this.analyzeTransaction(tx);
          }
        }
      } else {
        console.log(`📭 No new Treasury transactions`);
      }

      this.lastCheck = Date.now();

    } catch (error) {
      console.error(`❌ Treasury check failed:`, error);
    }
  }

  // ניתוח טרנזקציה לTreasury
  async analyzeTransaction(tx) {
    try {
      if (tx.code !== 0) {
        console.log(`⚠️ Failed transaction: ${tx.txhash}`);
        return;
      }

      // חיפוש העברות USDC לTreasury
      for (const msg of tx.tx.body.messages) {
        if (msg.typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
          const sendMsg = msg.value;

          if (sendMsg.toAddress === this.treasuryAddress) {
            for (const coin of sendMsg.amount) {
              // מקבל גם USDC וגם MSTBL לטסט
              if (coin.denom === 'uusdc' || coin.denom === 'mstbl') {
                const amount = parseInt(coin.amount) / 1_000_000;
                const currency = coin.denom === 'uusdc' ? 'USDC' : 'MSTBL';

                console.log(`\n💰 New ${currency} payment to Treasury detected!`);
                console.log(`📧 From: ${sendMsg.fromAddress}`);
                console.log(`💵 Amount: ${amount} ${currency}`);
                console.log(`🔗 TX: ${tx.txhash}`);

                // עיבוד הרכישה
                await this.processPurchase({
                  txHash: tx.txhash,
                  userAddress: sendMsg.fromAddress,
                  usdcAmount: amount
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`❌ Transaction analysis failed:`, error);
    }
  }

  // הפעלת מעקב רציף
  startMonitoring() {
    console.log(`👂 Starting Treasury monitoring...`);

    // בדיקה כל 10 שניות
    setInterval(() => {
      this.checkTreasuryTransactions();
    }, 10000);

    // סטטוס כל דקה
    setInterval(() => {
      console.log(`\n📊 SERVICE STATUS:`);
      console.log(`🏦 Monitoring Treasury: ${this.treasuryAddress}`);
      console.log(`🎯 Current phase: ${this.currentPhase}`);
      console.log(`💎 Tokens remaining: ${this.tokensRemainingInPhase}`);
      console.log(`💰 Current price: $${this.getCurrentPhasePrice()}`);
      console.log(`📊 Processed transactions: ${this.processedCount}`);
    }, 60000);
  }

  // הפעלת השירות
  start() {
    const port = process.env.PORT || 3002;
    this.app.listen(port, () => {
      console.log(`🚀 Direct Treasury Purchase Service running on port ${port}`);
      console.log(`📍 Health check: http://localhost:${port}/health`);
      console.log(`📊 Purchase info: http://localhost:${port}/purchase-info`);
    });
  }
}

// יצירת והפעלת השירות
async function main() {
  const service = new DirectTreasuryPurchaseService();

  const initialized = await service.initialize();
  if (!initialized) {
    console.error('❌ Service initialization failed');
    process.exit(1);
  }

  service.start();
  service.startMonitoring();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DirectTreasuryPurchaseService;
