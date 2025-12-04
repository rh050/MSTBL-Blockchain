import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { StatsData } from '@/pages/api/stats';

interface TokenomicsProps {
  className?: string;
}

const Tokenomics: React.FC<TokenomicsProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Try to fetch live stats first
      let response = await fetch('/api/live-stats');
      if (!response.ok) {
        // Fallback to static stats if live stats fail
        response = await fetch('/api/stats');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <div className="text-red-600 text-center">
          {error || t('tokenomics.loadError')}
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {t('tokenomics.title')}
          <span className="text-green-300 text-sm">{t('common.live')}</span>
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          {t('tokenomics.description')}
        </p>
      </div>

      {/* Live Stats */}
      <div className="p-6">
        {/* Chain Status Indicator */}
        <div className="mb-4 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">{t('status.connectedToChain')}</span>
          </div>
          <div className="text-green-600 text-sm">
            {t('status.blockHeight')}: {(stats as any).chainHeight || t('common.loading')}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats.totalSupply)}
            </div>
            <div className="text-sm text-gray-600">{t('stats.totalSupply')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.currentStage}
            </div>
            <div className="text-sm text-gray-600">{t('stats.currentStage')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(stats.tokensRemaining)}
            </div>
            <div className="text-sm text-gray-600">{t('stats.tokensRemaining')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(stats.nextStagePrice)}
            </div>
            <div className="text-sm text-gray-600">{t('stats.nextPrice')}</div>
          </div>
        </div>

        {/* Allocation */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-800">{t('tokenomics.allocation.reserve')}</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div>{t('tokenomics.allocation.marketing')}</div>
            <div>{t('tokenomics.allocation.treasury')}</div>
          </div>
        </div>

        {/* Stages */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">{t('tokenomics.stages.title')}</h4>
          <div className="space-y-2">
            {stats.stages && stats.stages.map((stage) => (
              <div
                key={stage.stage}
                className={`flex justify-between items-center p-3 rounded-lg border ${stage.status === 'active'
                  ? 'bg-green-50 border-green-200'
                  : stage.status === 'completed'
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-200'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${stage.status === 'active'
                      ? 'bg-green-500'
                      : stage.status === 'completed'
                        ? 'bg-gray-500'
                        : 'bg-yellow-500'
                      }`}
                  ></span>
                  <span className="font-medium">Stage {stage.stage}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNumber(stage.tokens)} MSTBL</div>
                  <div className="text-sm text-gray-600">{formatPrice(stage.price)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            {t('tokenomics.stages.trigger')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokenomics;
