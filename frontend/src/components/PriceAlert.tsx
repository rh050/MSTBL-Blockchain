import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';

interface PriceAlertProps {
  currentPrice: number;
  onPriceChange?: (newPrice: number, oldPrice: number) => void;
}

const PriceAlert: React.FC<PriceAlertProps> = ({ currentPrice, onPriceChange }) => {
  const { t } = useTranslation('common');
  const [previousPrice, setPreviousPrice] = useState(currentPrice);
  const [showAlert, setShowAlert] = useState(false);
  const [priceChange, setPriceChange] = useState<{
    from: number;
    to: number;
    type: 'increase' | 'decrease';
  } | null>(null);

  useEffect(() => {
    if (previousPrice !== currentPrice && previousPrice > 0) {
      const changeType = currentPrice > previousPrice ? 'increase' : 'decrease';

      setPriceChange({
        from: previousPrice,
        to: currentPrice,
        type: changeType
      });

      setShowAlert(true);

      // Call callback if provided
      if (onPriceChange) {
        onPriceChange(currentPrice, previousPrice);
      }

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }

    setPreviousPrice(currentPrice);
  }, [currentPrice, previousPrice, onPriceChange]);

  const handleDismiss = () => {
    setShowAlert(false);
  };

  if (!priceChange) return null;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4"
        >
          <div className={`rounded-lg p-4 shadow-lg border-l-4 ${priceChange.type === 'increase'
            ? 'bg-orange-50 border-orange-400 text-orange-800'
            : 'bg-blue-50 border-blue-400 text-blue-800'
            }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {priceChange.type === 'increase' ? (
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
                ) : (
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {priceChange.type === 'increase' ? t('price.increased') : t('price.decreased')}
                </p>
                <p className="text-xs mt-1">
                  ${priceChange.from.toFixed(2)} → ${priceChange.to.toFixed(2)} {t('price.perToken')}
                </p>
                {priceChange.type === 'increase' && (
                  <p className="text-xs mt-1 font-medium">
                    {t('price.refreshWarning')}
                  </p>
                )}
              </div>
              <button
                onClick={handleDismiss}
                className="ml-2 flex-shrink-0 text-sm hover:opacity-70"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PriceAlert;
