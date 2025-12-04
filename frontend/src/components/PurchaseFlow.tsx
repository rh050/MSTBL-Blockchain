import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import WalletStatus from './WalletStatus';
import { clsx } from 'clsx';

interface PurchaseFlowProps {
  onPurchase: (usdcAmount: string, mstblAmount: string) => Promise<{ success: boolean, error?: string }>;
  walletConnected: boolean;
  onConnectWallet: () => void;
  currentPrice?: number;
  loading?: boolean;
  // Wallet status props
  isKeplrInstalled?: boolean;
  isMobile?: boolean;
  isWalletLoading?: boolean;
  onInstallKeplr?: () => void;
}

const PurchaseFlow: React.FC<PurchaseFlowProps> = ({
  onPurchase,
  walletConnected,
  onConnectWallet,
  currentPrice = 1.0,
  loading = false,
  isKeplrInstalled = true,
  isMobile = false,
  isWalletLoading = false,
  onInstallKeplr = () => { },
}) => {
  const { t } = useTranslation('common');
  const [usdcAmount, setUsdcAmount] = useState('');
  const [mstblAmount, setMstblAmount] = useState('');
  // const [isCalculating, setIsCalculating] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate MSTBL amount when USDC amount changes
  useEffect(() => {
    if (usdcAmount && !isNaN(Number(usdcAmount))) {
      const calculatedMstbl = (Number(usdcAmount) / currentPrice).toFixed(6);
      setMstblAmount(calculatedMstbl);
    } else {
      setMstblAmount('');
    }
  }, [usdcAmount, currentPrice]);

  // Calculate USDC amount when MSTBL amount changes
  const handleMstblChange = (value: string) => {
    setMstblAmount(value);
    if (value && !isNaN(Number(value))) {
      const calculatedUsdc = (Number(value) * currentPrice).toFixed(2);
      setUsdcAmount(calculatedUsdc);
    } else {
      setUsdcAmount('');
    }
  };

  const handlePurchase = async () => {
    if (!usdcAmount || !mstblAmount) return;

    setPurchaseStatus('processing');
    setErrorMessage('');

    try {
      const result = await onPurchase(usdcAmount, mstblAmount);
      if (result.success) {
        setPurchaseStatus('success');
        setUsdcAmount('');
        setMstblAmount('');
        // Reset status after 3 seconds
        setTimeout(() => setPurchaseStatus('idle'), 3000);
      } else {
        setPurchaseStatus('error');
        setErrorMessage(result.error || t('purchase.error'));
      }
    } catch (err) {
      setPurchaseStatus('error');
      setErrorMessage(t('purchase.error'));
    }
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <section id="purchase" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('purchase.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('purchase.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="card hover:shadow-lg transition-shadow">
            {/* Wallet Status */}
            <div className="mb-6">
              <WalletStatus
                walletConnected={walletConnected}
                isKeplrInstalled={isKeplrInstalled}
                isMobile={isMobile}
                isLoading={isWalletLoading}
                onConnect={onConnectWallet}
                onInstall={onInstallKeplr}
              />
            </div>



            {/* Current Price Display */}
            <div className="text-center mb-6 p-4 bg-mstbl-primary/5 rounded-lg border-2 border-mstbl-primary/20">
              <div className="text-sm text-gray-600 mb-1">{t('purchase.currentPrice')}</div>
              <div className="text-3xl font-bold text-mstbl-primary">
                ${currentPrice.toFixed(2)} USDC
              </div>
              <div className="text-xs text-gray-500 mb-2">per MSTBL Token</div>
              <div className="text-xs font-semibold text-green-600 bg-green-50 rounded px-2 py-1 inline-block">
                💎 מחיר השלב הנוכחי - לזמן מוגבל!
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select (USDC)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setUsdcAmount(amount.toString())}
                    className={clsx(
                      "px-3 py-2 text-sm rounded-lg border transition-colors",
                      usdcAmount === amount.toString()
                        ? "bg-mstbl-primary text-white border-mstbl-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:border-mstbl-primary"
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* USDC Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('purchase.enterAmount')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={usdcAmount}
                    onChange={(e) => setUsdcAmount(e.target.value)}
                    placeholder="0.00"
                    className="input pr-16"
                    step="0.01"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm font-medium">USDC</span>
                  </div>
                </div>
              </div>

              {/* Conversion Arrow */}
              <div className="flex justify-center">
                <div className="p-2 bg-gray-100 rounded-full">
                  <ArrowsRightLeftIcon className="w-5 h-5 text-gray-600 rotate-90" />
                </div>
              </div>

              {/* MSTBL Output */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('purchase.youReceive')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mstblAmount}
                    onChange={(e) => handleMstblChange(e.target.value)}
                    placeholder="0.000000"
                    className="input pr-16"
                    step="0.000001"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm font-medium">MSTBL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Summary */}
            {usdcAmount && mstblAmount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>You pay:</span>
                    <span className="font-medium">{usdcAmount} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>You receive:</span>
                    <span className="font-medium">{mstblAmount} MSTBL</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Rate:</span>
                    <span className="font-medium">${currentPrice.toFixed(2)} per MSTBL</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Status Messages */}
            {purchaseStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-crypto-green/10 border border-crypto-green/20 rounded-lg flex items-center"
              >
                <CheckCircleIcon className="w-5 h-5 text-crypto-green mr-2 rtl:ml-2 rtl:mr-0" />
                <span className="text-crypto-green text-sm font-medium">
                  {t('purchase.success')}
                </span>
              </motion.div>
            )}

            {purchaseStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 rtl:ml-2 rtl:mr-0" />
                <span className="text-red-700 text-sm">
                  {errorMessage}
                </span>
              </motion.div>
            )}

            {/* Action Button */}
            <div className="mt-6">
              {!walletConnected ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onConnectWallet}
                  className="w-full"
                >
                  <CreditCardIcon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('purchase.connectWallet')}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePurchase}
                  loading={purchaseStatus === 'processing' || loading}
                  disabled={!usdcAmount || !mstblAmount || purchaseStatus === 'processing'}
                  className="w-full"
                >
                  {purchaseStatus === 'processing' ? (
                    '⏳ מעבד רכישה...'
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                      🚀 קנה עכשיו במחיר ${currentPrice.toFixed(2)}!
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Scarcity Reminder */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-xs space-y-1">
                <div className="font-bold text-blue-800">
                  ⚠️ {t('purchase.scarcityReminder')}
                </div>
                <div className="text-blue-700">
                  {t('purchase.scarcityDetails')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PurchaseFlow;
