import React, { useState, useEffect } from 'react';
import { useKeplr } from '@/hooks/useKeplr';

interface WalletBalanceProps {
  className?: string;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ className = '' }) => {
  const { walletInfo, getCw20Balance, isLoading } = useKeplr();
  const [balances, setBalances] = useState<{ native: string; cw20: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshBalances = async () => {
    if (!walletInfo || !getCw20Balance) return;

    setRefreshing(true);
    try {
      const newBalances = await getCw20Balance();
      setBalances(newBalances);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (walletInfo) {
      refreshBalances();
    }
  }, [walletInfo, getCw20Balance]);

  if (!walletInfo) {
    return null;
  }

  return (
    <div className={`wallet-balance-container ${className}`}>
      <div className="wallet-info">
        <h3 className="wallet-title">💎 יתרת הארנק</h3>
        <p className="wallet-address">
          {walletInfo.address.slice(0, 12)}...{walletInfo.address.slice(-8)}
        </p>
      </div>

      <div className="balances-grid">
        {/* Native MSTBL Balance */}
        <div className="balance-item native">
          <div className="balance-header">
            <span className="balance-type">⛽ Native MSTBL</span>
            <span className="balance-description">(לגז ועמלות)</span>
          </div>
          <div className="balance-amount">
            {refreshing ? '🔄' : balances ? `${balances.native}` : '0.000000'} MSTBL
          </div>
        </div>

        {/* CW20 MSTBL Balance */}
        <div className="balance-item cw20">
          <div className="balance-header">
            <span className="balance-type">💰 CW20 MSTBL</span>
            <span className="balance-description">(טוקני מסחר)</span>
          </div>
          <div className="balance-amount">
            {refreshing ? '🔄' : balances ? `${balances.cw20}` : '0.000000'} MSTBL
          </div>
        </div>
      </div>

      <button
        onClick={refreshBalances}
        disabled={refreshing || isLoading}
        className="refresh-button"
      >
        {refreshing ? '🔄 מרענן...' : '🔄 רענן יתרות'}
      </button>

      <div className="balance-info">
        <p className="info-text">
          <strong>💡 הסבר:</strong>
        </p>
        <ul className="info-list">
          <li><strong>Native MSTBL:</strong> משמש לתשלום עמלות גז ופעולות רשת</li>
          <li><strong>CW20 MSTBL:</strong> הטוקנים הראשיים למסחר והשקעות</li>
        </ul>
        <div className="keplr-explanation">
          <p className="info-note">
            🤔 <strong>למה 2 טוכנים?</strong>
          </p>
          <div className="explanation-content">
            <p><strong>Native MSTBL (10 MSTBL):</strong> &quot;הדלק&quot; של הרשת - לתשלום עמלות</p>
            <p><strong>CW20 MSTBL (849,999 MSTBL):</strong> הטוכנים הראשיים שלך למסחר</p>
          </div>
          <div className="recommendation">
            <p>💡 <strong>המלצה:</strong> השתמש ב-CW20 MSTBL לצורך מסחר והשקעות</p>
            <p>⚠️ <strong>זכור:</strong> תמיד שמור קצת Native MSTBL לעמלות!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wallet-balance-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 16px 0;
        }

        .wallet-info {
          text-align: center;
          margin-bottom: 24px;
        }

        .wallet-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        .wallet-address {
          font-family: monospace;
          font-size: 14px;
          opacity: 0.9;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          display: inline-block;
        }

        .balances-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .balance-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .balance-item.native {
          border-left: 4px solid #4ade80;
        }

        .balance-item.cw20 {
          border-left: 4px solid #fbbf24;
        }

        .balance-header {
          margin-bottom: 12px;
        }

        .balance-type {
          display: block;
          font-weight: bold;
          font-size: 14px;
        }

        .balance-description {
          display: block;
          font-size: 12px;
          opacity: 0.8;
          margin-top: 4px;
        }

        .balance-amount {
          font-size: 18px;
          font-weight: bold;
          font-family: monospace;
        }

        .refresh-button {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .balance-info {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .info-text {
          margin: 0 0 8px 0;
          font-weight: bold;
        }

        .info-list {
          margin: 8px 0;
          padding-right: 20px;
        }

        .info-list li {
          margin-bottom: 4px;
        }

        .keplr-explanation {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .info-note {
          margin: 0 0 12px 0;
          font-weight: bold;
          font-size: 16px;
        }

        .explanation-content {
          margin: 12px 0;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }

        .explanation-content p {
          margin: 8px 0;
        }

        .recommendation {
          background: rgba(74, 222, 128, 0.2);
          border-left: 3px solid #4ade80;
          padding: 12px;
          border-radius: 4px;
          margin-top: 12px;
        }

        .recommendation p {
          margin: 6px 0;
        }

        @media (max-width: 768px) {
          .balances-grid {
            grid-template-columns: 1fr;
          }

          .wallet-balance-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletBalance;
