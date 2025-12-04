import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    current: string;
    required: string;
    deficit: string;
    action: string;
    keplrAction?: string;
  };
}

const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;

  const handleGetUsdc = () => {
    // Direct link to Osmosis DEX for USDC purchase
    window.open('https://app.osmosis.zone/?from=ATOM&to=USDC', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-4 text-gray-900">
          {data.title}
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Current Balance:</span>
            <span className="font-semibold text-gray-900">{data.current} USDC</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Required Amount:</span>
            <span className="font-semibold text-gray-900">{data.required} USDC</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Need to Add:</span>
            <span className="font-bold text-red-600">{data.deficit} USDC</span>
          </div>
        </div>

        <p className="text-gray-700 text-center mb-4 font-medium">
          📝 Quick Guide: How to Get USDC in Keplr
        </p>

        {/* Simple visual guide */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-100">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 shadow-sm">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">Open Osmosis DEX</p>
                <p className="text-gray-600 text-xs">Click the button below to open Osmosis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 shadow-sm">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">Connect Your Keplr Wallet</p>
                <p className="text-gray-600 text-xs">Allow Osmosis to connect to your wallet</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 shadow-sm">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">Buy USDC</p>
                <p className="text-gray-600 text-xs">Swap any crypto to USDC (need {data.deficit} USDC)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 shadow-sm">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-800">Return Here</p>
                <p className="text-gray-600 text-xs">Come back and complete your MSTBL purchase</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGetUsdc}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
          >
            <ExternalLink className="h-5 w-5" />
            Open Osmosis DEX to Buy USDC
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            I&apos;ll Do This Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;
