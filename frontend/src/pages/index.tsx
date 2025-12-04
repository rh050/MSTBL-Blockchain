import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

// Components
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PurchaseFlow from '@/components/PurchaseFlow';
import Tokenomics from '@/components/Tokenomics';
import WalletConnectionGuide from '@/components/WalletConnectionGuide';
import PriceAlert from '@/components/PriceAlert';
// Hooks
import { useKeplr } from '@/hooks/useKeplr';

export default function HomePage() {
  const { t } = useTranslation('common');
  // const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showWalletGuide, setShowWalletGuide] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null);

  const {
    walletInfo,
    isLoading,
    isKeplrInstalled,
    isMobile,
    connect,
    // disconnect,
    sendTokens,
    // getBalance,
    openKeplrInstallation,
  } = useKeplr();

  // Fetch live stats including current price
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/live-stats');
        const data = await response.json();
        setLiveStats(data);
      } catch (error) {
        console.error('Failed to fetch live stats:', error);
      }
    };

    fetchStats();
    // Update every 10 seconds to ensure price is always current
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = async () => {
    const connected = await connect();
    if (!connected && !isKeplrInstalled) {
      setShowWalletGuide(true);
    }
  };

  const handleInstallKeplr = () => {
    openKeplrInstallation();
    setShowWalletGuide(false);
  };

  const handleRetryConnection = async () => {
    setShowWalletGuide(false);
    setTimeout(() => handleConnectWallet(), 500); // Small delay to allow modal to close
  };

  const handleGetStarted = () => {
    const purchaseSection = document.getElementById('purchase');
    if (purchaseSection) {
      purchaseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePurchase = async (usdcAmount: string, mstblAmount: string) => {
    try {
      // CRITICAL: Get fresh price data before purchase to prevent race conditions
      const priceResponse = await fetch('/api/live-stats');
      const freshStats = await priceResponse.json();
      const freshPrice = freshStats.stagePrice;

      // Validate that the purchase is still valid with current price
      const expectedMstbl = parseFloat(usdcAmount) / freshPrice;
      const actualMstbl = parseFloat(mstblAmount);
      const priceDifference = Math.abs(expectedMstbl - actualMstbl) / expectedMstbl;

      // If price difference is more than 1%, reject the transaction
      if (priceDifference > 0.01) {
        return {
          success: false,
          error: `Price changed! Current price: $${freshPrice.toFixed(2)}. Please refresh and try again.`
        };
      }

      // For now, we'll simulate a purchase by sending USDC to a treasury address
      // In a real implementation, this would interact with a smart contract
      const treasuryAddress = 'stbl1treasury...'; // This would be the actual treasury address
      const usdcDenom = 'uusdc';
      const amountInMicroUsdc = (parseFloat(usdcAmount) * 1_000_000).toString();

      const result = await sendTokens(treasuryAddress, amountInMicroUsdc, usdcDenom);

      if (result.success) {
        // In a real implementation, the smart contract would automatically mint MSTBL tokens
        // For demo purposes, we'll just show success
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Purchase failed' };
    }
  };

  // Get current price from live stats, fallback to 1.0
  const currentPrice = liveStats?.stagePrice || 1.0;
  const stats = {
    totalSupply: '1,000,000',
    currentStage: liveStats?.currentStage || 1,
    tokensRemaining: liveStats?.tokensRemaining?.toLocaleString() || '250,000',
    nextPrice: `$${(liveStats?.nextStagePrice || 10.0).toFixed(2)}`
  };

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('subtitle')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('title')} />
        <meta name="twitter:description" content={t('subtitle')} />
        <meta name="twitter:image" content="/twitter-image.png" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: {
              style: {
                border: '1px solid #10b981',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

        {/* Header */}
        <Header
          onConnectWallet={handleConnectWallet}
          walletConnected={!!walletInfo}
          walletAddress={walletInfo?.address}
        />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero
            onGetStarted={handleGetStarted}
            stats={stats}
          />

          {/* Purchase Flow Section */}
          <PurchaseFlow
            onPurchase={handlePurchase}
            walletConnected={!!walletInfo}
            onConnectWallet={handleConnectWallet}
            currentPrice={currentPrice}
            loading={isLoading}
            isKeplrInstalled={isKeplrInstalled}
            isMobile={isMobile}
            isWalletLoading={isLoading}
            onInstallKeplr={handleInstallKeplr}
          />

          {/* About Section */}
          <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('features.title')}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: t('features.stability.title'),
                    description: t('features.stability.description'),
                    icon: '💰'
                  },
                  {
                    title: t('features.security.title'),
                    description: t('features.security.description'),
                    icon: '🔒'
                  },
                  {
                    title: t('features.transparency.title'),
                    description: t('features.transparency.description'),
                    icon: '👁️'
                  },
                  {
                    title: t('features.governance.title'),
                    description: t('features.governance.description'),
                    icon: '🗳️'
                  }
                ].map((feature, index) => (
                  <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tokenomics Section */}
          <section id="tokenomics" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Tokenomics />
            </div>
          </section>


        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-mstbl-gradient rounded-lg flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{t('brand.name')}</h1>
                    <p className="text-sm text-gray-400">{t('brand.fullName')}</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  {t('brand.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('common.links')}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">{t('footer.links.privacy')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('footer.links.terms')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('footer.links.contact')}</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Community</h3>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    🐦
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Discord</span>
                    💬
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Telegram</span>
                    ✈️
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </footer>

        {/* Wallet Connection Guide Modal */}
        {showWalletGuide && (
          <WalletConnectionGuide
            isKeplrInstalled={isKeplrInstalled}
            isMobile={isMobile}
            onInstallKeplr={handleInstallKeplr}
            onRetryConnection={handleRetryConnection}
          />
        )}

        {/* Price Alert Component */}
        <PriceAlert
          currentPrice={currentPrice}
          onPriceChange={(newPrice, oldPrice) => {
            // Price change tracked for UI updates
          }}
        />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
