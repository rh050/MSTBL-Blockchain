import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

interface SalesSimulatorProps {
  onSalesUpdate?: (newTotalSold: number) => void;
}

const SalesSimulator: React.FC<SalesSimulatorProps> = ({ onSalesUpdate }) => {
  const [totalSold, setTotalSold] = useState(0);
  const [amount, setAmount] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCurrentSales();
  }, []);

  const fetchCurrentSales = async () => {
    try {
      const response = await fetch('/api/simulate-sales');
      if (response.ok) {
        const data = await response.json();
        setTotalSold(data.totalSold);
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    }
  };

  const simulateSale = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/simulate-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });

      if (response.ok) {
        const data = await response.json();
        setTotalSold(data.newTotalSold);
        if (onSalesUpdate) {
          onSalesUpdate(data.newTotalSold);
        }
      }
    } catch (error) {
      console.error('Failed to simulate sale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSales = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/simulate-sales', {
        method: 'DELETE',
      });

      if (response.ok) {
        setTotalSold(0);
        if (onSalesUpdate) {
          onSalesUpdate(0);
        }
      }
    } catch (error) {
      console.error('Failed to reset sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStage = (sold: number) => {
    if (sold < 250000) return 1;
    if (sold < 500000) return 2;
    if (sold < 750000) return 3;
    return 4;
  };

  const getCurrentPrice = (sold: number) => {
    const stage = getCurrentStage(sold);
    const prices = [1.00, 10.00, 100.00, 1000.00];
    return prices[stage - 1];
  };

  const currentStage = getCurrentStage(totalSold);
  const currentPrice = getCurrentPrice(totalSold);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 p-6 rounded-xl border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧪 Sales Simulator (Demo Only)
      </h3>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Sold</div>
          <div className="text-2xl font-bold text-mstbl-primary">
            {totalSold.toLocaleString()} MSTBL
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-600">Current Stage & Price</div>
          <div className="text-2xl font-bold text-orange-600">
            Stage {currentStage} - ${currentPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Tokens to sell"
          className="flex-1 min-w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mstbl-primary focus:border-transparent"
        />

        <Button
          onClick={simulateSale}
          disabled={isLoading}
          size="md"
          variant="primary"
        >
          {isLoading ? '⏳' : '🚀'} Sell Tokens
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[1000, 50000, 100000, 250000].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {preset.toLocaleString()}
          </button>
        ))}
      </div>

      <Button
        onClick={resetSales}
        disabled={isLoading}
        size="sm"
        variant="secondary"
        className="w-full"
      >
        🔄 Reset Sales
      </Button>

      <div className="mt-4 text-xs text-gray-500">
        <strong>Stage Thresholds:</strong><br />
        Stage 1: 0-250K ($1.00) | Stage 2: 250K-500K ($10.00)<br />
        Stage 3: 500K-750K ($100.00) | Stage 4: 750K-1M ($1000.00)
      </div>
    </motion.div>
  );
};

export default SalesSimulator;
