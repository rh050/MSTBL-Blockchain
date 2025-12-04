import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import Button from './Button';

interface WalletStatusProps {
  walletConnected: boolean;
  isKeplrInstalled: boolean;
  isMobile: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onInstall: () => void;
}

const WalletStatus: React.FC<WalletStatusProps> = ({
  walletConnected,
  isKeplrInstalled,
  isMobile,
  isLoading,
  onConnect,
  onInstall,
}) => {
  const { t } = useTranslation('common');

  if (walletConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-green-600"
      >
        <CheckCircleIcon className="w-5 h-5" />
        <span className="text-sm font-medium">{t('wallet.connected')}</span>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-blue-600"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm font-medium">{t('wallet.connecting')}</span>
      </motion.div>
    );
  }

  if (!isKeplrInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
      >
        <div className="flex items-start space-x-3">
          <ExclamationCircleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-orange-800 mb-1">
              {isMobile ? t('wallet.mobile.required') : t('wallet.extension.required')}
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              {isMobile
                ? t('wallet.mobile.description')
                : t('wallet.extension.description')
              }
            </p>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onInstall}
              >
                {isMobile ? t('wallet.mobile.getApp') : t('wallet.extension.install')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onConnect}
              >
                {t('wallet.retry')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div className="flex items-start space-x-3">
        <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-800 mb-1">
            {t('wallet.readyToConnect')}
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            {t('wallet.readyDescription')}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onConnect}
          >
            {t('wallet.connectWalletWithIcon')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletStatus;
