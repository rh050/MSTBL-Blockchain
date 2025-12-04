import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';
import { clsx } from 'clsx';

interface HeaderProps {
  onConnectWallet: () => void;
  walletConnected: boolean;
  walletAddress?: string;
}

const Header: React.FC<HeaderProps> = ({
  onConnectWallet,
  walletConnected,
  walletAddress
}) => {
  const { t } = useTranslation('common');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const navigation = [
    { name: t('navigation.home'), href: '#home', current: true },
    { name: t('navigation.about'), href: '#about', current: false },
    { name: t('navigation.tokenomics'), href: '#tokenomics', current: false },
    { name: t('navigation.roadmap'), href: '#roadmap', current: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-mstbl-gradient rounded-lg flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('brand.name')}</h1>
                <p className="text-xs text-gray-600 hidden sm:block">{t('brand.fullName')}</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={clsx(
                  item.current
                    ? 'text-mstbl-primary border-b-2 border-mstbl-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'px-3 py-2 text-sm font-medium border-b-2 border-transparent transition-colors'
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />

            {walletConnected ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-crypto-green rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {formatAddress(walletAddress || '')}
                </span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onConnectWallet}
              >
                {t('wallet.connectWallet')}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    item.current
                      ? 'text-mstbl-primary bg-mstbl-primary/5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                    'block px-3 py-2 text-base font-medium rounded-lg transition-colors'
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              {walletConnected ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2">
                  <div className="w-2 h-2 bg-crypto-green rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatAddress(walletAddress || '')}
                  </span>
                </div>
              ) : (
                <div className="px-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      onConnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    {t('wallet.connectWallet')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
