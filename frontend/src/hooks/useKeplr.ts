import { useState, useEffect, useCallback } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
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

// Get the base URL for assets
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://mstbl-prod-v1-329336973316.us-central1.run.app';
};

// MSTBL Chain Configuration - Using CW20 as PRIMARY currency
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
    // CW20 MSTBL as primary currency
    {
      coinDenom: 'MSTBL',
      coinMinimalDenom: `cw20:${getEnvVar('NEXT_PUBLIC_MSTBL_CONTRACT', 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d')}:MSTBL`,
      coinDecimals: 6,
      coinGeckoId: 'mstbl',
      coinImageUrl: `${getBaseUrl()}/MSTBL_LOGO.png`,
    }
  ],
  feeCurrencies: [
    // CW20 token for gas fees
    {
      coinDenom: 'MSTBL',
      coinMinimalDenom: `cw20:${getEnvVar('NEXT_PUBLIC_MSTBL_CONTRACT', 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d')}:MSTBL`,
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    }
  ],
  coinType: 118,
  beta: true,
  features: ['cosmwasm', 'ibc-transfer', 'ibc-go'], // Removed deprecated 'stargate' and 'no-legacy-stdTx'
};

export const useKeplr = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeplrInstalled, setIsKeplrInstalled] = useState(false);
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [queryClient, setQueryClient] = useState<CosmWasmClient | null>(null);

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
    if (!isKeplrInstalled || !window.keplr) {
      // Check if mobile device
      const isMobileDevice = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); if (isMobileDevice) {
        // Mobile: Try to open Keplr Mobile with deep link to add chain
        try {
          // Create a deep link to add MSTBL chain to Keplr Mobile
          const chainInfoJson = encodeURIComponent(JSON.stringify({
            chainId: MSTBL_CHAIN_INFO.chainId,
            chainName: MSTBL_CHAIN_INFO.chainName,
            rpc: MSTBL_CHAIN_INFO.rpc,
            rest: MSTBL_CHAIN_INFO.rest,
            bip44: { coinType: MSTBL_CHAIN_INFO.coinType },
            bech32Config: MSTBL_CHAIN_INFO.bech32Config,
            currencies: MSTBL_CHAIN_INFO.currencies,
            feeCurrencies: MSTBL_CHAIN_INFO.feeCurrencies,
            stakeCurrency: MSTBL_CHAIN_INFO.stakeCurrency,
            beta: MSTBL_CHAIN_INFO.beta,
            features: MSTBL_CHAIN_INFO.features,
          }));

          // Try Keplr Mobile deep link first
          const keplrDeepLink = `keplrwallet://wcV1?${chainInfoJson}`;
          window.location.href = keplrDeepLink;

          // Wait a moment to see if Keplr Mobile opens
          await new Promise(resolve => setTimeout(resolve, 2000));

          // If still here, Keplr Mobile is not installed
          const userConfirmed = confirm(
            'Keplr Mobile is required. Would you like to install it?'
          );

          if (userConfirmed) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const storeUrl = isIOS
              ? 'https://apps.apple.com/app/keplr-wallet/id1567851089'
              : 'https://play.google.com/store/apps/details?id=com.chainapsis.keplr';

            window.open(storeUrl, '_blank');
          }

          toast.error('Please install Keplr Mobile app to continue');
          return false;
        } catch (mobileError) {
          console.error('Failed to open Keplr Mobile:', mobileError);
          toast.error('Failed to connect to Keplr Mobile');
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
      // Check if mobile device to use appropriate method
      const isMobileDevice = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Force suggest MSTBL chain to Keplr (this will overwrite any cached config)
      console.log('🔗 Suggesting MSTBL chain to Keplr...');

      const chainConfig = {
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
        beta: MSTBL_CHAIN_INFO.beta,
        features: MSTBL_CHAIN_INFO.features,
      };

      if (isMobileDevice) {
        // Mobile: Use direct Keplr API without timeout (mobile is slower)
        console.log('📱 Mobile device detected - using mobile-friendly connection');
        try {
          await window.keplr.experimentalSuggestChain(chainConfig);
          console.log('✅ Chain successfully added to Keplr Mobile');
        } catch (mobileChainError: any) {
          console.error('❌ Failed to add chain to Keplr Mobile:', mobileChainError);
          if (mobileChainError.message?.includes('rejected')) {
            throw new Error('Chain addition was rejected. Please accept the chain in Keplr Mobile.');
          }
          throw mobileChainError;
        }
      } else {
        // Desktop: Use timeout to prevent hanging
        const chainSuggestionPromise = window.keplr.experimentalSuggestChain(chainConfig);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Chain suggestion timeout - Keplr might be busy')), 15000)
        );

        await Promise.race([chainSuggestionPromise, timeoutPromise]);
        console.log('✅ Chain successfully added to Keplr');
      }

      // Now suggest CW20 token to Keplr for better UX
      try {
        const cw20ContractAddress = getEnvVar('NEXT_PUBLIC_MSTBL_CONTRACT', 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d');

        // Check if suggestToken method is available
        if (window.keplr.suggestToken && typeof window.keplr.suggestToken === 'function') {
          await window.keplr.suggestToken(MSTBL_CHAIN_INFO.chainId, cw20ContractAddress);
        } else {
          console.warn('⚠️ Keplr suggestToken method not available - manual token addition required');
        }
      } catch (tokenError: any) {
        console.warn('⚠️ Failed to suggest CW20 token:', tokenError);
        // Check if it's a connection error or method not supported
        if (tokenError?.message && tokenError.message.includes('Could not establish connection')) {
          console.warn('🔌 Keplr connection issue detected - extension might be disabled or reloading');
        } else if (tokenError?.message && tokenError.message.includes('not implemented')) {
          console.warn('📋 Keplr suggestToken not implemented - user needs to add token manually');
        }
        // This is not a fatal error - continue with connection
      }

      // Enable Keplr for MSTBL chain
      await window.keplr.enable(MSTBL_CHAIN_INFO.chainId);

      // Get offline signer
      const offlineSigner = window.keplr.getOfflineSigner(MSTBL_CHAIN_INFO.chainId);

      // Create signing client
      const signingClient = await SigningStargateClient.connectWithSigner(
        MSTBL_CHAIN_INFO.rpc,
        offlineSigner
      );

      // Create query client for CW20 interactions
      const cosmWasmClient = await CosmWasmClient.connect(MSTBL_CHAIN_INFO.rpc);

      // Get accounts
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];

      // Validate that the address has the correct bech32 prefix
      const expectedPrefix = MSTBL_CHAIN_INFO.bech32Config.bech32PrefixAccAddr;
      const actualPrefix = account.address.slice(0, account.address.indexOf('1'));

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
      setQueryClient(cosmWasmClient);
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
    setQueryClient(null);
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

  // Get primary MSTBL balance (CW20 as main balance)
  const getPrimaryBalance = useCallback(async (): Promise<string> => {
    if (!walletInfo || !queryClient) {
      return '0';
    }

    try {
      const cw20ContractAddress = getEnvVar('NEXT_PUBLIC_MSTBL_CONTRACT', 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d');

      const cw20QueryMsg = {
        balance: {
          address: walletInfo.address
        }
      };

      let cw20Balance = '0';
      try {
        const cw20Result = await queryClient.queryContractSmart(cw20ContractAddress, cw20QueryMsg);
        cw20Balance = cw20Result.balance || '0';
      } catch (cw20Error) {
        console.warn('Failed to get CW20 balance via CosmWasm client:', cw20Error);        // Fallback: try REST API directly
        try {
          const restEndpoint = getEnvVar('NEXT_PUBLIC_REST_ENDPOINT', 'https://api.stbl.mstbl.com');
          const queryMsgBase64 = btoa(JSON.stringify(cw20QueryMsg));
          const restUrl = `${restEndpoint}/cosmwasm/wasm/v1/contract/${cw20ContractAddress}/smart/${queryMsgBase64}`;

          const response = await fetch(restUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.data) {
              const decodedData = JSON.parse(atob(data.data));
              cw20Balance = decodedData.balance || '0';
            }
          }
        } catch (restError) {
          console.warn('Failed to get CW20 balance via REST API:', restError);
        }
      }

      const cw20Amount = (parseInt(cw20Balance) / Math.pow(10, 6)).toFixed(6);

      return cw20Amount;
    } catch (error) {
      console.error('Failed to get primary balance:', error);
      return '0';
    }
  }, [walletInfo, queryClient]);

  // Deprecated - keeping for backward compatibility
  const getCw20Balance = useCallback(async (): Promise<{ native: string; cw20: string }> => {
    const primaryBalance = await getPrimaryBalance();
    return {
      native: '0', // Hide native balance
      cw20: primaryBalance
    };
  }, [getPrimaryBalance]);  // Check if mobile device
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
  }, [isMobile]);

  // Add CW20 MSTBL token to Keplr wallet (manual trigger)
  const addTokenToKeplr = useCallback(async (): Promise<boolean> => {
    if (!isKeplrInstalled || !window.keplr) {
      throw new Error('Keplr wallet not installed or not loaded');
    }

    try {
      // Check if Keplr is responsive before suggesting token
      const keplr = window.keplr;
      if (!keplr.suggestToken) {
        throw new Error('Keplr does not support token suggestion');
      }

      const chainId = getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'mstbl-1');
      const contractAddress = getEnvVar('NEXT_PUBLIC_MSTBL_CONTRACT', 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d');

      await keplr.suggestToken(chainId, contractAddress);
      return true;
    } catch (error: unknown) {
      // Handle different types of errors appropriately
      if (error instanceof Error) {
        if (error.message.includes('does not exist') ||
          error.message.includes('connection') ||
          error.message.includes('polyfill')) {
          // These are connection/loading errors - rethrow for user feedback
          throw new Error('Keplr connection issue. Please try again in a moment.');
        }
        // Other errors - rethrow as-is
        throw error;
      }
      throw new Error('Unknown error occurred while adding token');
    }
  }, [isKeplrInstalled]);

  // Check USDC balance
  const getUsdcBalance = useCallback(async (): Promise<string> => {
    if (!client || !walletInfo) {
      return '0';
    }

    try {
      // Try different USDC denominations that might exist
      const possibleDenoms = ['usdc', 'uusdc', 'ibc/USDC', 'USDC'];

      for (const denom of possibleDenoms) {
        try {
          const balance = await client.getBalance(walletInfo.address, denom);
          if (balance.amount !== '0') {
            // Found USDC balance, convert based on denomination
            let usdcAmount;
            if (denom.startsWith('u') && denom !== 'usdc') {
              // Micro denomination, divide by 1,000,000
              usdcAmount = (parseInt(balance.amount) / 1_000_000).toString();
            } else {
              // Standard denomination
              usdcAmount = (parseInt(balance.amount) / 1_000_000).toString();
            }
            console.log(`Found USDC balance: ${usdcAmount} USDC (denom: ${denom})`);
            return usdcAmount;
          }
        } catch (denomError) {
          // This denomination doesn't exist, try next
          continue;
        }
      }

      return '0';
    } catch (error) {
      console.warn('Failed to get USDC balance:', error);
      return '0';
    }
  }, [client, walletInfo]); return {
    walletInfo,
    isLoading,
    isKeplrInstalled,
    isMobile,
    client,
    queryClient,
    connect,
    disconnect,
    sendTokens,
    getBalance,
    getPrimaryBalance,
    getUsdcBalance, // New USDC balance function
    getCw20Balance, // Deprecated - use getPrimaryBalance instead
    addTokenToKeplr,
    openKeplrInstallation,
    chainInfo: MSTBL_CHAIN_INFO,
  };
};
