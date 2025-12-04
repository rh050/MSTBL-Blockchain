import { useState, useEffect, useCallback } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { WalletInfo, TransactionResult, ChainInfo } from '@/types';
import toast from 'react-hot-toast';
import KeplrMobileDeepLink from '@/utils/keplrMobile';

// Declare Keplr types
declare global {
  interface Window {
    keplr: any;
  }
}

// Get environment variables (for client-side)
const getEnvVar = (key: string, defaultValue: string) => {
  return process.env[key] || defaultValue;
};

// MSTBL Chain Configuration
const MSTBL_CHAIN_INFO: ChainInfo = {
  chainId: getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'mstbl-1'),
  chainName: 'MSTBL Network',
  rpc: getEnvVar('NEXT_PUBLIC_RPC_ENDPOINT', 'https://rpc.stbl.mstbl.com'),
  rest: getEnvVar('NEXT_PUBLIC_REST_ENDPOINT', 'https://api.stbl.mstbl.com'),
  bech32Config: {
    bech32PrefixAccAddr: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm'),
    bech32PrefixAccPub: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'pub',
    bech32PrefixValAddr: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valoper',
    bech32PrefixValPub: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valoperpub',
    bech32PrefixConsAddr: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valcons',
    bech32PrefixConsPub: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valconspub',
  },
  currencies: [
    {
      coinDenom: 'STAKE',
      coinMinimalDenom: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'stake'),
      coinDecimals: 6,
      coinGeckoId: 'mstbl',
    }
  ],
  feeCurrencies: [
    {
      coinDenom: 'STAKE',
      coinMinimalDenom: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'stake'),
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    }
  ],
  stakeCurrency: {
    coinDenom: 'STAKE',
    coinMinimalDenom: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'stake'),
    coinDecimals: 6,
  },
  coinType: 118,
};

export const useKeplr = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeplrInstalled, setIsKeplrInstalled] = useState(false);
  const [client, setClient] = useState<SigningStargateClient | null>(null);

  // Check if Keplr is installed
  useEffect(() => {
    const checkKeplr = () => {
      if (typeof window !== 'undefined') {
        setIsKeplrInstalled(!!window.keplr);
      }
    };

    checkKeplr();

    // Check periodically in case Keplr is installed after page load
    const interval = setInterval(checkKeplr, 1000);
    setTimeout(() => clearInterval(interval), 10000); // Stop checking after 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    if (isKeplrInstalled && typeof window !== 'undefined') {
      const savedWallet = localStorage.getItem('mstbl-wallet-connected');
      if (savedWallet === 'true') {
        connect();
      }
    }
  }, [isKeplrInstalled]);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!isKeplrInstalled) {
      // Check if mobile device
      const isMobileDevice = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobileDevice) {
        // Mobile: Check if Keplr Mobile app is available
        const isKeplrMobileAvailable = typeof window !== 'undefined' && window.keplr;

        if (!isKeplrMobileAvailable) {
          // Show mobile-specific message with redirect options
          const userConfirmed = confirm(
            'Keplr wallet is required to connect. Would you like to install Keplr Mobile app?'
          );

          if (userConfirmed) {
            // Detect iOS or Android and redirect to appropriate store
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const storeUrl = isIOS
              ? 'https://apps.apple.com/app/keplr-wallet/id1567851089'
              : 'https://play.google.com/store/apps/details?id=com.chainapsis.keplr';

            window.open(storeUrl, '_blank');
          }

          toast.error('Please install Keplr Mobile app to continue');
          return false;
        }
      } else {
        // Desktop: Show extension installation message
        const userConfirmed = confirm(
          'Keplr wallet extension is required to connect. Would you like to install it?'
        );

        if (userConfirmed) {
          window.open('https://www.keplr.app/download', '_blank');
        }

        toast.error('Please install Keplr wallet extension');
        return false;
      }
    }

    setIsLoading(true);

    try {
      // Force suggest MSTBL chain to Keplr (this will overwrite any cached config)
      console.log('🔄 Force suggesting MSTBL chain with correct bech32 prefix:', MSTBL_CHAIN_INFO.bech32Config.bech32PrefixAccAddr);

      await window.keplr.experimentalSuggestChain({
        chainId: MSTBL_CHAIN_INFO.chainId,
        chainName: MSTBL_CHAIN_INFO.chainName,
        rpc: MSTBL_CHAIN_INFO.rpc,
        rest: MSTBL_CHAIN_INFO.rest,
        bip44: {
          coinType: MSTBL_CHAIN_INFO.coinType,
        },
        bech32Config: MSTBL_CHAIN_INFO.bech32Config,
        currencies: MSTBL_CHAIN_INFO.currencies,
        feeCurrencies: MSTBL_CHAIN_INFO.feeCurrencies,
        stakeCurrency: MSTBL_CHAIN_INFO.stakeCurrency,
        gasPriceStep: MSTBL_CHAIN_INFO.gasPriceStep,
      });

      console.log('✅ Chain suggestion completed');

      // Enable Keplr for MSTBL chain
      await window.keplr.enable(MSTBL_CHAIN_INFO.chainId);

      // Get offline signer
      const offlineSigner = window.keplr.getOfflineSigner(MSTBL_CHAIN_INFO.chainId);

      // Create signing client
      const signingClient = await SigningStargateClient.connectWithSigner(
        MSTBL_CHAIN_INFO.rpc,
        offlineSigner
      );

      // Get accounts
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];

      // Validate that the address has the correct bech32 prefix
      const expectedPrefix = MSTBL_CHAIN_INFO.bech32Config.bech32PrefixAccAddr;
      const actualPrefix = account.address.slice(0, account.address.indexOf('1'));

      console.log('🔍 Address validation:', {
        address: account.address,
        expectedPrefix,
        actualPrefix,
        isCorrect: actualPrefix === expectedPrefix
      });

      if (actualPrefix !== expectedPrefix) {
        console.error('❌ Keplr generated address with wrong prefix!', {
          expected: expectedPrefix,
          actual: actualPrefix,
          address: account.address
        });

        throw new Error(
          `Keplr wallet cache issue detected! Expected address prefix "${expectedPrefix}" but got "${actualPrefix}". ` +
          `Please clear Keplr cache: Go to Keplr → Settings → Advanced → Reset or remove MSTBL chain and try again.`
        );
      }

      console.log('✅ Address prefix validation passed');

      // Get balance
      const balance = await signingClient.getBalance(
        account.address,
        MSTBL_CHAIN_INFO.currencies[0].coinMinimalDenom
      );

      const walletInfo: WalletInfo = {
        address: account.address,
        name: 'Keplr',
        balance: (parseInt(balance.amount) / Math.pow(10, MSTBL_CHAIN_INFO.currencies[0].coinDecimals)).toFixed(6),
        isConnected: true,
      };

      setWalletInfo(walletInfo);
      setClient(signingClient);
      localStorage.setItem('mstbl-wallet-connected', 'true');

      toast.success('Wallet connected successfully!');
      return true;

    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isKeplrInstalled]);

  const disconnect = useCallback(() => {
    setWalletInfo(null);
    setClient(null);
    localStorage.removeItem('mstbl-wallet-connected');
    toast.success('Wallet disconnected');
  }, []);

  const sendTokens = useCallback(async (
    recipientAddress: string,
    amount: string,
    denom: string
  ): Promise<TransactionResult> => {
    if (!client || !walletInfo) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      setIsLoading(true);

      const fee = {
        amount: [
          {
            denom: MSTBL_CHAIN_INFO.currencies[0].coinMinimalDenom,
            amount: '5000', // 0.005 STBL
          },
        ],
        gas: '200000',
      };

      const result = await client.sendTokens(
        walletInfo.address,
        recipientAddress,
        [{ denom, amount }],
        fee,
        'MSTBL Purchase'
      );

      toast.success('Transaction successful!');

      return {
        success: true,
        txHash: result.transactionHash,
        gasUsed: result.gasUsed.toString(),
      };

    } catch (error: any) {
      console.error('Transaction failed:', error);
      const errorMsg = error.message || 'Transaction failed';
      toast.error(errorMsg);

      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  }, [client, walletInfo]);

  const getBalance = useCallback(async (denom?: string): Promise<string> => {
    if (!client || !walletInfo) {
      return '0';
    }

    try {
      const balance = await client.getBalance(
        walletInfo.address,
        denom || MSTBL_CHAIN_INFO.currencies[0].coinMinimalDenom
      );

      const decimals = denom === 'uusdc' ? 6 : MSTBL_CHAIN_INFO.currencies[0].coinDecimals;
      return (parseInt(balance.amount) / Math.pow(10, decimals)).toFixed(6);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }, [client, walletInfo]);

  // Check if mobile device
  const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Open Keplr installation page
  const openKeplrInstallation = useCallback(async () => {
    if (isMobile) {
      // Use advanced mobile deep linking
      await KeplrMobileDeepLink.redirectToKeplr(true);
    } else {
      // Desktop - open Keplr website
      window.open('https://www.keplr.app/download', '_blank');
    }
  }, [isMobile]); return {
    walletInfo,
    isLoading,
    isKeplrInstalled,
    isMobile,
    client,
    connect,
    disconnect,
    sendTokens,
    getBalance,
    openKeplrInstallation,
    chainInfo: MSTBL_CHAIN_INFO,
  };
};
