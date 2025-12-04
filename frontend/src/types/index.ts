// Wallet Connection Types
export interface WalletInfo {
  address: string;
  name: string;
  balance: string;
  isConnected: boolean;
}

// Transaction Types
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  gasUsed?: string;
}

// MSTBL Sale Types
export interface SaleStage {
  stage: number;
  price: string; // in USDC per MSTBL
  tokensRemaining: string;
  tokensTotal: string;
  isActive: boolean;
}

export interface SaleStatus {
  currentStage: SaleStage;
  totalSupply: string;
  totalSold: string;
  totalRaised: string;
  stages: SaleStage[];
}

// Cosmos Chain Types
export interface ChainInfo {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: Currency[];
  feeCurrencies: Currency[];
  stakeCurrency?: Currency;
  coinType: number;
  gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
  beta?: boolean;
  features?: string[];
}

export interface Currency {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
  coinImageUrl?: string;
  gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
}

// Purchase Flow Types
export interface PurchaseRequest {
  usdcAmount: string;
  mstblAmount: string;
  walletAddress: string;
  slippage?: number;
}

// Language Types
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Environment Variables Types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CHAIN_ID: string;
      NEXT_PUBLIC_RPC_ENDPOINT: string;
      NEXT_PUBLIC_REST_ENDPOINT: string;
      NEXT_PUBLIC_BECH32_PREFIX: string;
      NEXT_PUBLIC_COIN_DENOM: string;
      NEXT_PUBLIC_COIN_DECIMALS: string;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_SALE_CONTRACT_ADDRESS?: string;
      NEXT_PUBLIC_USDC_CONTRACT_ADDRESS?: string;
    }
  }
}
