// 🚀 MSTBL Optimized Purchase Service
// מעבר מblock scanning לREST API queries עבור ביצועים מעולים

const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { SigningStargateClient, CosmWasmClient } = require('@cosmjs/stargate');
const { MsgExecuteContract } = require('cosmjs-types/cosmwasm/wasm/v1/tx');
const express = require('express');
const cors = require('cors');

class OptimizedPurchaseService {
  constructor() {
    this.rpcEndpoint = process.env.RPC_ENDPOINT || 'http://34.57.32.80:26657';
    this.restEndpoint = process.env.REST_ENDPOINT || 'http://34.57.32.80:1317';
    this.saleWalletMnemonic = process.env.SALE_WALLET_MNEMONIC || 
      "arrest praise abuse upset crucial way embody bamboo awake blind volume tornado shadow link female jump dose salt hub govern pattern pulp neutral weekend";
    this.treasuryAddress = process.env.TREASURY_ADDRESS || 'wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu';
    this.mstblContract = process.env.MSTBL_CONTRACT || 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d';
    
    // Service state
    this.processedTransactions = new Set();
    this.lastCheck = Date.now();
    this.processedCount = 0;
    this.currentPhase = 1;
    this.tokensRemainingInPhase = 250000;
    
    // Sale phases configuration
    this.salePhases = [
      { phase: 1, price: 1.00, maxTokens: 250000 },
      { phase: 2, price: 10.00, maxTokens: 250000 },
      { phase: 3, price: 100.00, maxTokens: 250000 },
      { phase: 4, price: 1000.00, maxTokens: 250000 }
    ];

    this.app = express();
    this.setupExpress();
    
    console.log('🚀 MSTBL Optimized Purchase Service initializing...');
  }

  setupExpress() {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'MSTBL Purchase Service',
        currentPhase: this.currentPhase,
        tokensRemaining: this.tokensRemainingInPhase,
        currentPrice: this.getCurrentPhasePrice(),
        processedTransactions: this.processedCount,
        lastCheck: new Date(this.lastCheck).toISOString(),
        uptime: process.uptime()
      });
    });

    // Metrics endpoint for monitoring
    this.app.get('/metrics', (req, res) => {
      res.json({
        processedTransactions: this.processedCount,
        currentPhase: this.currentPhase,
        tokensRemaining: this.tokensRemainingInPhase,
        processedHashes: this.processedTransactions.size,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      });
    });

    // Manual trigger endpoint for testing
    this.app.post('/trigger-check', async (req, res) => {
      try {
        console.log('🔍 Manual transaction check triggered');
        await this.checkForNewTransactions();
        res.json({ success: true, message: 'Check completed' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
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

      console.log(`✅ Connected to MSTBL blockchain`);
      console.log(`📧 Sale wallet: ${this.saleAddress}`);
      console.log(`🏦 Treasury: ${this.treasuryAddress}`);
      console.log(`💎 MSTBL Contract: ${this.mstblContract}`);

      return true;
    } catch (error) {
      console.error(`❌ Failed to initialize:`, error);
      return false;
    }
  }

  getCurrentPhasePrice() {
    const phase = this.salePhases.find(p => p.phase === this.currentPhase);
    return phase ? phase.price : 1.00;
  }

  // ✅ NEW: Optimized transaction detection using REST API
  async checkForNewTransactions() {
    try {
      this.lastCheck = Date.now();
      
      // ✅ Query only transactions TO our sale address (much more efficient!)
      const query = `transfer.recipient='${this.saleAddress}'`;
      const url = `${this.restEndpoint}/cosmos/tx/v1beta1/txs?events=${encodeURIComponent(query)}&order_by=ORDER_BY_DESC&limit=20`;
      
      console.log(`🔍 Checking for new transactions to ${this.saleAddress}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`REST API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const transactions = data.txs || [];
      
      console.log(`📊 Found ${transactions.length} total transactions to sale address`);
      
      // Process only new transactions we haven't seen before
      let newCount = 0;
      for (const tx of transactions) {
        if (!this.processedTransactions.has(tx.txhash)) {
          console.log(`🆕 New transaction detected: ${tx.txhash}`);
          await this.processTransaction(tx);
          this.processedTransactions.add(tx.txhash);
          newCount++;
          
          // Cleanup old processed transactions (keep last 1000)
          if (this.processedTransactions.size > 1000) {
            const oldHashes = Array.from(this.processedTransactions).slice(0, 500);
            oldHashes.forEach(hash => this.processedTransactions.delete(hash));
          }
        }
      }
      
      if (newCount > 0) {
        console.log(`✅ Processed ${newCount} new transactions`);
      } else {
        console.log(`📊 No new transactions since last check`);
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`⏰ Transaction check timeout`);
      } else {
        console.error(`❌ Error checking transactions:`, error.message);
      }
    }
  }

  async processTransaction(transaction) {
    try {
      // Parse transaction to find USDC transfers
      for (const event of transaction.events || []) {
        if (event.type === 'transfer') {
          await this.processTransferEvent(event, transaction);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to process transaction ${transaction.txhash}:`, error);
    }
  }

  async processTransferEvent(event, transaction) {
    try {
      const attributes = {};
      for (const attr of event.attributes) {
        attributes[attr.key] = attr.value;
      }
      
      // Check if this is a USDC transfer to our sale address
      if (attributes.recipient === this.saleAddress && 
          (attributes.amount?.includes('uusdc') || attributes.amount?.includes('mstbl'))) {
        
        const amount = attributes.amount;
        const sender = attributes.sender;
        
        // Parse amount and denomination
        const match = amount.match(/^(\d+)(\w+)$/);
        if (!match) return;
        
        const tokenAmount = parseInt(match[1]) / 1_000_000;
        const denom = match[2];
        const currencyName = denom === 'uusdc' ? 'USDC' : 'MSTBL';
        
        console.log(`\n💰 New ${currencyName} purchase detected!`);
        console.log(`📧 From: ${sender}`);
        console.log(`💵 Amount: ${tokenAmount} ${currencyName}`);
        console.log(`🔗 TX: ${transaction.txhash}`);
        
        // Process the purchase
        await this.processPurchase({
          sender,
          amount: tokenAmount,
          txHash: transaction.txhash,
          currency: currencyName,
          denom
        });
      }
    } catch (error) {
      console.error(`❌ Failed to process transfer event:`, error);
    }
  }

  async processPurchase(purchase) {
    const { sender, amount, txHash, currency = 'USDC', denom = 'uusdc' } = purchase;
    
    try {
      console.log(`\n💰 Processing purchase from ${sender}`);
      console.log(`💵 ${currency} Amount: ${amount}`);
      
      // Calculate MSTBL amount based on current phase
      const currentPrice = this.getCurrentPhasePrice();
      const mstblAmount = Math.floor((amount / currentPrice) * 1_000_000); // Convert to micro-MSTBL
      const mstblDisplay = (mstblAmount / 1_000_000).toFixed(6);
      
      console.log(`💎 MSTBL to send: ${mstblDisplay} (${mstblAmount} micro-MSTBL)`);
      console.log(`📈 Current price: $${currentPrice}`);
      
      // Check if we have enough tokens in current phase
      if (mstblAmount > this.tokensRemainingInPhase * 1_000_000) {
        console.log(`⚠️ Not enough tokens in current phase`);
        return false;
      }

      // Step 1: Transfer payment tokens to Treasury
      console.log(`📤 Transferring ${currency} to Treasury...`);
      const paymentTransferResult = await this.client.sendTokens(
        this.saleAddress,
        this.treasuryAddress,
        [{ denom: denom, amount: (amount * 1_000_000).toString() }],
        {
          amount: [{ denom: 'mstbl', amount: '5000' }],
          gas: '200000'
        },
        `${currency} Payment for MSTBL Purchase - TX: ${txHash}`
      );

      console.log(`✅ ${currency} transfer completed: ${paymentTransferResult.transactionHash}`);

      // Step 2: Send MSTBL to buyer using CW20 contract
      console.log(`📤 Sending MSTBL to buyer...`);
      const mstblTransferMsg = {
        transfer: {
          recipient: sender,
          amount: mstblAmount.toString()
        }
      };

      const executeMsg = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: this.saleAddress,
          contract: this.mstblContract,
          msg: new TextEncoder().encode(JSON.stringify(mstblTransferMsg)),
          funds: []
        })
      };

      const mstblTransferResult = await this.client.signAndBroadcast(
        this.saleAddress,
        [executeMsg],
        {
          amount: [{ denom: 'mstbl', amount: '5000' }],
          gas: '300000'
        }
      );

      console.log(`✅ MSTBL transfer completed: ${mstblTransferResult.transactionHash}`);

      // Update phase tracking
      this.tokensRemainingInPhase -= mstblAmount / 1_000_000;
      if (this.tokensRemainingInPhase <= 0) {
        this.currentPhase++;
        this.tokensRemainingInPhase = 250000;
        console.log(`🎯 Phase ${this.currentPhase - 1} completed! Moving to Phase ${this.currentPhase}`);
      }

      console.log(`📊 Tokens remaining in Phase ${this.currentPhase}: ${this.tokensRemainingInPhase}`);

      // Log successful purchase
      console.log(`\n🎉 PURCHASE COMPLETED:`);
      console.log(`👤 Buyer: ${sender}`);
      console.log(`💵 Paid: ${amount} ${currency}`);
      console.log(`💎 Received: ${mstblDisplay} MSTBL`);
      console.log(`🏦 ${currency} TX: ${paymentTransferResult.transactionHash}`);
      console.log(`💎 MSTBL TX: ${mstblTransferResult.transactionHash}`);

      this.processedCount++;
      return true;

    } catch (error) {
      console.error(`❌ Failed to process purchase:`, error);
      return false;
    }
  }

  async start() {
    const success = await this.initialize();
    if (!success) {
      console.error('❌ Failed to initialize service');
      process.exit(1);
    }

    console.log(`👂 Starting optimized transaction monitoring...`);
    
    // ✅ Check every 5 seconds instead of continuous scanning
    setInterval(() => {
      this.checkForNewTransactions().catch(console.error);
    }, 5000);

    // Status report every minute
    setInterval(() => {
      console.log(`📊 SERVICE STATUS:`);
      console.log(`🎯 Current phase: ${this.currentPhase}`);
      console.log(`💎 Tokens remaining: ${this.tokensRemainingInPhase}`);
      console.log(`💰 Purchases processed: ${this.processedCount}`);
      console.log(`🕒 Last check: ${new Date(this.lastCheck).toLocaleTimeString()}`);
    }, 60000);

    // Start Express server
    const port = process.env.PORT || 3002;
    this.app.listen(port, () => {
      console.log(`🌐 Service running on port ${port}`);
      console.log(`🔗 Health check: http://localhost:${port}/health`);
      console.log(`📊 Metrics: http://localhost:${port}/metrics`);
    });
  }
}

// Start the service
if (require.main === module) {
  const service = new OptimizedPurchaseService();
  service.start().catch(console.error);
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Service shutting down gracefully...');
    process.exit(0);
  });
}

module.exports = OptimizedPurchaseService;