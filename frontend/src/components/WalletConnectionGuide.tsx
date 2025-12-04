import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface WalletConnectionGuideProps {
  isKeplrInstalled: boolean;
  isMobile: boolean;
  onInstallKeplr: () => void;
  onRetryConnection: () => void;
}

const WalletConnectionGuide: React.FC<WalletConnectionGuideProps> = ({
  isKeplrInstalled,
  isMobile,
  onInstallKeplr,
  onRetryConnection,
}) => {
  if (isKeplrInstalled) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Keplr Wallet Required
          </h3>

          <div className="flex items-center justify-center mb-4">
            {isMobile ? (
              <DevicePhoneMobileIcon className="w-8 h-8 text-blue-500 mr-2" />
            ) : (
              <ComputerDesktopIcon className="w-8 h-8 text-blue-500 mr-2" />
            )}
            <span className="text-sm text-gray-600">
              {isMobile ? 'Mobile Device Detected' : 'Desktop Browser Detected'}
            </span>
          </div>

          {isMobile ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                To connect your wallet, you need the Keplr Mobile app.
                Download it from your device&apos;s app store.
              </p>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onInstallKeplr}
                  className="w-full"
                >
                  📱 Download Keplr Mobile
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={onRetryConnection}
                  className="w-full"
                >
                  🔄 I Already Have Keplr - Retry
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Instructions:</strong><br />
                  1. Download Keplr from App Store/Google Play<br />
                  2. Create or import your wallet<br />
                  3. Return to this page and retry connection
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                To connect your wallet, you need the Keplr browser extension.
                Install it from the official website.
              </p>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onInstallKeplr}
                  className="w-full"
                >
                  🌐 Install Keplr Extension
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={onRetryConnection}
                  className="w-full"
                >
                  🔄 I Already Have Keplr - Retry
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Instructions:</strong><br />
                  1. Click &quot;Install Keplr Extension&quot;<br />
                  2. Add extension to your browser<br />
                  3. Create or import your wallet<br />
                  4. Refresh this page
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletConnectionGuide;
