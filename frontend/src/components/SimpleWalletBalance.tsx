import React, { useState, useEffect, useCallback } from 'react';
import { useKeplr } from '@/hooks/useKeplr';

interface SimpleWalletBalanceProps {
  className?: string;
}

export const SimpleWalletBalance: React.FC<SimpleWalletBalanceProps> = ({ className = '' }) => {
  const { walletInfo, getPrimaryBalance, isLoading } = useKeplr();
  const [balance, setBalance] = useState<string>('0');
  const [refreshing, setRefreshing] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!walletInfo || !getPrimaryBalance) {
      return;
    }

    setRefreshing(true);
    try {
      const newBalance = await getPrimaryBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    } finally {
      setRefreshing(false);
    }
  }, [walletInfo, getPrimaryBalance]);

  useEffect(() => {
    if (walletInfo) {
      refreshBalance();
    }
  }, [walletInfo, refreshBalance]);

  if (!walletInfo) {
    return null;
  }

  return (
    <div className={`simple-wallet-balance ${className}`}>
      <div className="wallet-info">
        <h3 className="wallet-title">💎 MSTBL Balance</h3>
        <p className="wallet-address">
          {walletInfo.address.slice(0, 12)}...{walletInfo.address.slice(-8)}
        </p>
      </div>

      <div className="balance-display">
        <div className="balance-amount">
          {refreshing ? '🔄 Loading...' : `${balance} MSTBL`}
        </div>
        <div className="balance-note">
          Your primary MSTBL tokens
        </div>
      </div>

      <button
        onClick={refreshBalance}
        disabled={refreshing || isLoading}
        className="refresh-button"
      >
        {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Balance'}
      </button>

      <style jsx>{`
        .simple-wallet-balance {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 16px 0;
          text-align: center;
        }

        .wallet-info {
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

        .balance-display {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .balance-amount {
          font-size: 36px;
          font-weight: bold;
          font-family: monospace;
          margin-bottom: 8px;
        }

        .balance-note {
          font-size: 14px;
          opacity: 0.8;
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
        }

        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .simple-wallet-balance {
            padding: 16px;
          }

          .balance-amount {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleWalletBalance;
