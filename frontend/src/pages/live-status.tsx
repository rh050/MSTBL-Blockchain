import { useState, useEffect } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';

interface WalletBalance {
  address: string;
  name: string;
  stake: string;
  mstbl?: string;
  status: 'active' | 'empty' | 'error';
}

interface SystemStatus {
  chainInfo: {
    chainId: string;
    blockHeight: string;
    nodeInfo: any;
  };
  mstblContract: {
    address: string;
    totalSupply: string;
    name: string;
    symbol: string;
  };
  wallets: WalletBalance[];
  lastUpdated: string;
}

export default function LiveStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/live-status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">🔄 טוען מצב המערכת...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-400">❌ שגיאה</h1>
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchStatus}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🔴 LIVE System Status</h1>
          <div className="flex items-center space-x-4">
            <span className="text-green-400">● LIVE</span>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              {loading ? '🔄' : '🔄 רענן'}
            </button>
          </div>
        </div>

        {status && (
          <div className="space-y-6">
            {/* Chain Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-400">⛓️ מידע רשת</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400">Chain ID:</label>
                  <p className="text-white font-mono">{status.chainInfo.chainId}</p>
                </div>
                <div>
                  <label className="text-gray-400">Block Height:</label>
                  <p className="text-white font-mono">{status.chainInfo.blockHeight}</p>
                </div>
                <div>
                  <label className="text-gray-400">Last Updated:</label>
                  <p className="text-white font-mono">{new Date(status.lastUpdated).toLocaleString('he-IL')}</p>
                </div>
              </div>
            </div>

            {/* MSTBL Contract */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">🪙 חוזה MSTBL</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400">שם:</label>
                  <p className="text-white">{status.mstblContract.name}</p>
                </div>
                <div>
                  <label className="text-gray-400">סמל:</label>
                  <p className="text-white">{status.mstblContract.symbol}</p>
                </div>
                <div>
                  <label className="text-gray-400">כתובת:</label>
                  <p className="text-white font-mono text-sm break-all">{status.mstblContract.address}</p>
                </div>
                <div>
                  <label className="text-gray-400">סיפלי כולל:</label>
                  <p className="text-white font-bold">{status.mstblContract.totalSupply} MSTBL</p>
                </div>
              </div>
            </div>

            {/* Wallets */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-green-400">👛 ארנקים</h2>
              <div className="space-y-4">
                {status.wallets.map((wallet, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{wallet.name}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${wallet.status === 'active' ? 'bg-green-600' :
                          wallet.status === 'empty' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                        {wallet.status === 'active' ? '✅ פעיל' :
                          wallet.status === 'empty' ? '⚠️ ריק' : '❌ שגיאה'}
                      </span>
                    </div>
                    <p className="text-gray-400 font-mono text-sm break-all mb-2">{wallet.address}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm">Stake:</label>
                        <p className="text-white">{wallet.stake}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">MSTBL:</label>
                        <p className="text-white">{wallet.mstbl || 'לבדיקה ידנית'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div className="bg-red-900 border border-red-600 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ התראות חשובות</h2>
              <ul className="space-y-2 text-red-200">
                <li>• זוהי מערכת LIVE - כל שינוי משפיע על המטבע הפעיל</li>
                <li>• לפני כל העברה - בצע בדיקה עם כמות קטנה</li>
                <li>• שמור גיבוי של כל המפתחות הפרטיים</li>
                <li>• תאם עם הצוות לפני שינויים גדולים</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
