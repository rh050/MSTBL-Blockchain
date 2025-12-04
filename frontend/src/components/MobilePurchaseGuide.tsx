import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MobilePurchaseGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  colors: string;
  downloadUrls: {
    ios: string;
    android: string;
  };
  features: string[];
  description: string;
  deepLink: string;
  isRecommended: boolean;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'keplr',
    name: 'Keplr',
    icon: '🟣',
    colors: 'from-purple-500 to-purple-600',
    downloadUrls: {
      ios: 'https://apps.apple.com/app/keplr-wallet/id1567851089',
      android: 'https://play.google.com/store/apps/details?id=com.chainapsis.keplr'
    },
    features: ['Cosmos Native', 'DeFi Optimized', 'Multiple Chains'],
    description: 'The most popular Cosmos wallet with native staking support',
    deepLink: 'keplrwallet://',
    isRecommended: false
  },
  {
    id: 'cosmostation',
    name: 'Cosmostation',
    icon: '🌟',
    colors: 'from-blue-500 to-cyan-500',
    downloadUrls: {
      ios: 'https://apps.apple.com/app/cosmostation/id1459830339',
      android: 'https://play.google.com/store/apps/details?id=wannabit.io.cosmostaion'
    },
    features: ['iOS Optimized', 'Multi-Chain', 'Staking Rewards'],
    description: 'Excellent iOS Safari compatibility with Cosmos ecosystem',
    deepLink: 'cosmostation://',
    isRecommended: true // Recommended for iOS
  },
  {
    id: 'leap',
    name: 'Leap Wallet',
    icon: '🦘',
    colors: 'from-orange-500 to-red-500',
    downloadUrls: {
      ios: 'https://apps.apple.com/app/leap-cosmos-wallet/id1642465549',
      android: 'https://play.google.com/store/apps/details?id=io.leapwallet.cosmos'
    },
    features: ['Fast Transactions', 'NFT Support', 'Swap Integration'],
    description: 'Modern wallet with built-in DeFi features and swaps',
    deepLink: 'leapwallet://',
    isRecommended: false
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '💙',
    colors: 'from-blue-600 to-blue-700',
    downloadUrls: {
      ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
      android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
    },
    features: ['Multi-Chain', 'Popular Choice', 'iOS Compatible'],
    description: 'Trusted multi-chain wallet with excellent mobile support',
    deepLink: 'trust://',
    isRecommended: true // Recommended for iOS
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    colors: 'from-orange-400 to-orange-600',
    downloadUrls: {
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
      android: 'https://play.google.com/store/apps/details?id=io.metamask'
    },
    features: ['EVM + Cosmos', 'Web3 Standard', 'DApp Browser'],
    description: 'World\'s leading wallet with Cosmos support via Snaps',
    deepLink: 'metamask://',
    isRecommended: false
  }
];

const MobilePurchaseGuide: React.FC<MobilePurchaseGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [isAddingChain, setIsAddingChain] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
    }
  }, []);

  // Handle wallet selection
  const handleWalletSelection = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setCurrentStep(1); // Move to setup step
  };

  // Generate wallet-specific instructions
  const generateWalletInstructions = (wallet: WalletOption): string => {
    const baseInstructions = `📱 ${wallet.name} Setup:

🔧 ADD MSTBL NETWORK:

📋 NETWORK DETAILS:
• Chain Name: MSTBL Network
• Chain ID: mstbl-1
• RPC URL: https://rpc.stbl.mstbl.com
• REST URL: https://api.stbl.mstbl.com
• Coin Denom: MSTBL
• Coin Decimals: 6`;

    switch (wallet.id) {
      case 'cosmostation':
        return `${baseInstructions}

🌟 Cosmostation Steps:
1️⃣ Open Cosmostation app
2️⃣ Tap "Wallet" → "Manage"
3️⃣ Tap "+" to add network
4️⃣ Enter the details above
5️⃣ Save and return to website

✅ Great choice for iOS!`;

      case 'trust':
        return `${baseInstructions}

💙 Trust Wallet Steps:
1️⃣ Open Trust Wallet app
2️⃣ Tap Settings → Networks
3️⃣ Tap "Add Custom Network"
4️⃣ Enter the details above
5️⃣ Enable and return to website

✅ Perfect for iOS Safari!`;

      case 'leap':
        return `${baseInstructions}

🦘 Leap Wallet Steps:
1️⃣ Open Leap Wallet app
2️⃣ Tap Settings → Manage Chains
3️⃣ Tap "Add Chain"
4️⃣ Enter the details above
5️⃣ Save and return to website

✅ Modern and smooth!`;

      case 'metamask':
        return `${baseInstructions}

🦊 MetaMask Steps:
1️⃣ Open MetaMask app
2️⃣ Install Cosmos Snaps
3️⃣ Add MSTBL network via Snaps
4️⃣ Connect to chain
5️⃣ Return to purchase

✅ Advanced Web3 features!`;

      case 'keplr':
      default:
        return `${baseInstructions}

🟣 Keplr Steps:
1️⃣ Open Keplr app
2️⃣ Tap Settings → Manage Chain Visibility
3️⃣ Search "MSTBL" or add manually
4️⃣ Enter the details above
5️⃣ Enable and return to website

✅ Full-featured wallet!`;
    }
  };

  // Connect with selected wallet
  const connectWithSelectedWallet = async () => {
    if (!selectedWallet) return;

    setIsAddingChain(true);

    try {
      // Try to open the wallet app directly
      window.location.href = selectedWallet.deepLink;

      // Show wallet-specific instructions
      const instructions = generateWalletInstructions(selectedWallet);

      setTimeout(() => {
        alert(instructions);

        // Move to next step
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
        setIsAddingChain(false);
      }, 2000);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Fallback to app store
      const storeUrl = isIOS ? selectedWallet.downloadUrls.ios : selectedWallet.downloadUrls.android;
      if (confirm(`${selectedWallet.name} is not installed. Would you like to download it?`)) {
        window.open(storeUrl, '_blank');
      }
      setIsAddingChain(false);
    }
  };

  // Function for iOS Safari - Manual instructions with simple app opening
  const connectViaManualInstructions = async () => {
    setIsAddingChain(true);

    // Try to open Keplr app directly
    try {
      window.location.href = 'keplrwallet://';
    } catch (error) {
      console.log('Deep link failed, continuing with instructions');
    }

    // Show detailed manual instructions
    const instructions = `📱 iOS Safari - Manual Setup Required:

🔧 ADD MSTBL NETWORK TO KEPLR:

1️⃣ Open Keplr Mobile app
2️⃣ Tap Settings (⚙️) at bottom
3️⃣ Tap "Manage Chain Visibility"
4️⃣ Tap "+" or "Add Chain"
5️⃣ Enter these details:

📋 NETWORK DETAILS:
• Chain Name: MSTBL Network
• Chain ID: mstbl-1
• RPC URL: https://rpc.stbl.mstbl.com
• REST URL: https://api.stbl.mstbl.com
• Coin Denom: MSTBL
• Coin Decimals: 6

6️⃣ Save and enable the network
7️⃣ Return to this website
8️⃣ Try connecting your wallet

✅ MSTBL should now appear in Keplr!`;

    alert(instructions);

    // Move to next step
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
      setIsAddingChain(false);
    }, 2000);
  };

  // Function to add MSTBL Chain directly to Keplr
  const addChainToKeplr = async () => {
    setIsAddingChain(true);
    try {
      // If iOS and Keplr not detected, use manual instructions
      if (isIOS && !window.keplr) {
        await connectViaManualInstructions();
        return;
      }

      if (!window.keplr) {
        alert('Keplr wallet is not installed. Please install it first or use manual setup.');
        return;
      }

      const getEnvVar = (key: string, defaultValue: string) => {
        return process.env[key] || defaultValue;
      };

      const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
          return window.location.origin;
        }
        return 'https://mstbl-prod-v1-329336973316.us-central1.run.app';
      };

      const chainConfig = {
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
            coinMinimalDenom: 'stake',
            coinDecimals: 0,
          },
          {
            coinDenom: 'MSTBL',
            coinMinimalDenom: `cw20:${getEnvVar('NEXT_PUBLIC_MSTBL_CONTRACT', 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d')}:MSTBL`,
            coinDecimals: 6,
            coinGeckoId: 'mstbl',
            coinImageUrl: `${getBaseUrl()}/MSTBL_LOGO.png`,
          }
        ],
        feeCurrencies: [
          {
            coinDenom: 'MSTBL-GAS',
            coinMinimalDenom: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'mstbl'),
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
          coinMinimalDenom: 'stake',
          coinDecimals: 0,
        },
        coinType: 118,
        beta: true,
        features: ['cosmwasm', 'ibc-transfer', 'ibc-go'],
      };

      await window.keplr.experimentalSuggestChain(chainConfig);
      alert('✅ MSTBL Chain successfully added to Keplr!');

      // Move to next step after successful addition
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      console.error('Failed to add chain:', error);
      if (error.message?.includes('rejected')) {
        alert('Chain addition was rejected. Please accept the chain in Keplr.');
      } else {
        alert('Failed to add chain. Please try again or add manually in Keplr settings.');
      }
    } finally {
      setIsAddingChain(false);
    }
  };

  if (!isOpen) return null;

  const getRecommendedWallets = () => {
    if (isIOS) {
      // For iOS, recommend Cosmostation and Trust Wallet
      return WALLET_OPTIONS.filter(w => w.isRecommended);
    }
    // For Android, all wallets work well
    return WALLET_OPTIONS;
  };

  const steps = currentStep === 0 ? [
    {
      icon: '�',
      title: 'Choose Your Wallet',
      description: `Select from ${getRecommendedWallets().length} popular Cosmos wallets. ${isIOS ? 'Optimized for iOS Safari' : 'All work great on Android'}`,
      action: 'Choose Wallet',
      color: 'from-purple-500 to-blue-500',
      isWalletSelection: true
    }
  ] : [
    // Previous step - wallet selection (hidden in UI but keeps indexing)
    {
      icon: '👛',
      title: 'Choose Your Wallet',
      description: '',
      action: '',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: selectedWallet?.icon || '�',
      title: `Setup ${selectedWallet?.name || 'Wallet'}`,
      description: selectedWallet ?
        `Configure ${selectedWallet.name} wallet to work with MSTBL network` :
        'Configure your wallet to work with MSTBL network',
      action: selectedWallet ? `Setup ${selectedWallet.name}` : 'Setup Wallet',
      isChainAdd: true,
      color: selectedWallet?.colors || 'from-blue-500 to-blue-600',
      instructions: selectedWallet ? [
        `Open ${selectedWallet.name} app`,
        'Add MSTBL network with provided details',
        'Enable the network in settings',
        'Return to this website'
      ] : []
    },
    {
      icon: '🟢',
      title: 'Buy USDC',
      description: 'Purchase USDC tokens to use for buying MSTBL',
      action: 'Get USDC',
      url: 'https://app.osmosis.zone/?from=ATOM&to=USDC',
      color: 'from-green-500 to-green-600',
      instructions: [
        'Open Osmosis DEX',
        'Connect your Keplr wallet',
        'Swap any crypto to USDC',
        'Confirm the transaction'
      ]
    },
    {
      icon: '🟠',
      title: 'Buy MSTBL',
      description: 'Return to this page and complete your MSTBL purchase',
      action: 'Start Purchase',
      color: 'from-orange-500 to-orange-600',
      instructions: [
        'Come back to this website',
        'Enter the amount of USDC',
        'Click "Buy MSTBL" button',
        'Approve in Keplr wallet'
      ]
    },
  ];

  const currentStepData = steps[currentStep];

  const handleAction = async () => {
    // If this is wallet selection step
    if (currentStep === 0) {
      // This will be handled by wallet selection buttons
      return;
    }

    // If this is the "Add Chain" step, handle wallet setup
    if (currentStep === 1) {
      if (selectedWallet) {
        await connectWithSelectedWallet();
      } else {
        // Fallback to Keplr setup
        await addChainToKeplr();
      }
      return;
    }

    // For other steps, open the URL if available
    const stepData = steps[currentStep];
    if ('url' in stepData && stepData.url) {
      window.open(stepData.url, '_blank');
    }

    // Move to next step or close on last step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Platform Notice - Only show on first step */}
          {currentStep === 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">
                  {isIOS ? '📱 iOS User:' : '🤖 Android User:'}
                </span> {isIOS ? 'We recommend Cosmostation or Trust Wallet for best iOS Safari compatibility' : 'All wallets work great on Android'}.
              </p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'w-8 bg-gradient-to-r ' + currentStepData.color
                  : index < currentStep
                    ? 'w-2 bg-gray-400'
                    : 'w-2 bg-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg text-5xl">
              {currentStepData.icon}
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">
            {currentStepData.title}
          </h3>
          <p className="text-center text-gray-600 mb-6">
            {currentStepData.description}
          </p>

          {/* Wallet Selection Grid - Only show on step 0 */}
          {currentStep === 0 && (
            <div className="grid gap-3 mb-6">
              {getRecommendedWallets().map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelection(wallet)}
                  className={`relative overflow-hidden rounded-xl p-4 text-left transition-all transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r ${wallet.colors} text-white`}
                >
                  {/* Recommended Badge */}
                  {wallet.isRecommended && isIOS && (
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-bold text-white">⭐ iOS Optimized</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{wallet.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-white">{wallet.name}</h4>
                      </div>
                      <p className="text-white/90 text-sm mb-2 leading-relaxed">
                        {wallet.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {wallet.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selection Arrow */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Instructions - Only show on non-wallet-selection steps */}
          {currentStep > 0 && 'instructions' in currentStepData && currentStepData.instructions && currentStepData.instructions.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-blue-600">📋</span>
                Quick Steps:
              </h4>
              <ul className="space-y-2">
                {currentStepData.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons - Only show on non-wallet-selection steps */}
          {currentStep > 0 && (
            <div className="space-y-3">
              <button
                onClick={handleAction}
                disabled={isAddingChain}
                className={`w-full bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAddingChain ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    {currentStepData.icon}
                    <span>{currentStepData.action}</span>
                  </>
                )}
              </button>

              {currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  disabled={isAddingChain}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Already Done - Next Step
                </button>
              )}

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isAddingChain}
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back to Previous Step
                </button>
              )}
            </div>
          )}

          {/* Step Counter */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
            {selectedWallet && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {selectedWallet.icon} {selectedWallet.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePurchaseGuide;
