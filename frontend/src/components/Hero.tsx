import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ArrowRightIcon, ShieldCheckIcon, CurrencyDollarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { motion } from 'framer-motion';

interface HeroProps {
  onGetStarted: () => void;
  stats?: {
    totalSupply: string;
    currentStage: number;
    tokensRemaining: string;
    nextPrice: string;
  };
}

interface LiveStatsData {
  totalSold: number;
  tokensRemaining: number;
  chainStatus: string;
  currentPrice: number;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, stats }) => {
  const { t } = useTranslation('common');

  // State for live blockchain data
  const [liveStats, setLiveStats] = useState<LiveStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live stats from blockchain
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/live-stats');
        const data = await response.json();
        setLiveStats(data);
      } catch (error) {
        console.error('Failed to fetch live stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStats();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchLiveStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: ShieldCheckIcon,
      title: t('features.security.title'),
      description: t('features.security.description')
    },
    {
      icon: CurrencyDollarIcon,
      title: t('features.stability.title'),
      description: t('features.stability.description')
    },
    {
      icon: GlobeAltIcon,
      title: t('features.transparency.title'),
      description: t('features.transparency.description')
    }
  ];

  const defaultStats = {
    totalSupply: '150,000',
    currentStage: 1,
    tokensRemaining: '37,500',
    nextPrice: '$1.20'
  };

  const currentStats = stats || defaultStats;

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16 pb-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left rtl:lg:text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-mstbl-primary/10 text-mstbl-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-mstbl-primary rounded-full mr-2 rtl:ml-2 rtl:mr-0 animate-pulse-slow" />
              {t('status.progressiveSaleLive')}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              <span className="text-gradient">{t('hero.title')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start rtl:lg:justify-end mb-12"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                className="group"
              >
                {t('hero.cta.primary')}
                <ArrowRightIcon className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.cta.secondary')}
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-mstbl-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-mstbl-primary" />
                  </div>
                  <div className="text-left rtl:text-right">
                    <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:pl-8 rtl:lg:pr-8 rtl:lg:pl-0"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Total Supply */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="stat-card hover:shadow-mstbl"
              >
                <div className="stat-number">{currentStats.totalSupply}</div>
                <div className="stat-label">{t('stats.totalSupply')}</div>
              </motion.div>

              {/* Current Stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="stat-card hover:shadow-mstbl"
              >
                <div className="stat-number">Stage {currentStats.currentStage}</div>
                <div className="stat-label">{t('stats.currentStage')}</div>
              </motion.div>

              {/* Tokens Remaining */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="stat-card hover:shadow-mstbl"
              >
                <div className="stat-number text-crypto-green">{currentStats.tokensRemaining}</div>
                <div className="stat-label">{t('stats.tokensRemaining')}</div>
              </motion.div>

              {/* Next Price */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="stat-card hover:shadow-mstbl"
              >
                <div className="stat-number text-gradient-gold">{currentStats.nextPrice}</div>
                <div className="stat-label">{t('stats.nextPrice')}</div>
              </motion.div>
            </div>

            {/* Sale Progress - Only show if over 150K sold */}
            {liveStats && liveStats.totalSold > 150000 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Sale Progress</span>
                  <span className="text-sm text-mstbl-primary font-semibold">
                    {((liveStats.totalSold / 1000000) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(liveStats.totalSold / 1000000) * 100}%` }}
                    transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
                    className="bg-mstbl-gradient h-2 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{liveStats.totalSold.toLocaleString()} MSTBL Sold</span>
                  <span>{(1000000 - liveStats.totalSold).toLocaleString()} Remaining</span>
                </div>
              </motion.div>
            )}

            {/* Show simple scarcity message when no significant sales yet */}
            {liveStats && liveStats.totalSold <= 150000 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border-2 border-blue-200 shadow-sm"
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 mb-3">
                    ⚠️ {t('purchase.scarcityWarning')}
                  </div>
                  {liveStats.chainStatus === 'active' && (
                    <div className="mt-3 flex items-center justify-center text-xs text-green-600 bg-green-50 rounded-lg p-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      {t('status.readyToPurchase')}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Loading state */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    🔄 Loading Sale Data...
                  </div>
                  <div className="text-xs text-gray-500">
                    Connecting to STBL Blockchain
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
