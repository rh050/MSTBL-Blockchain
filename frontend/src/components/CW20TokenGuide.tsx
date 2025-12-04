import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useKeplr } from '@/hooks/useKeplr';

interface CW20TokenGuideProps {
  className?: string;
}

const CW20TokenGuide: React.FC<CW20TokenGuideProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');
  const { walletInfo, chainInfo } = useKeplr();
  const [showGuide, setShowGuide] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_MSTBL_CONTRACT || 'wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d';

  const addTokenToKeplr = async () => {
    if (!window.keplr || !walletInfo) {
      alert(t('cw20Guide.alerts.connectFirst'));
      return;
    }

    try {
      // Check if suggestToken method exists
      if (!window.keplr.suggestToken || typeof window.keplr.suggestToken !== 'function') {
        throw new Error('suggestToken method not available');
      }

      // Try to suggest the token
      await window.keplr.suggestToken(chainInfo.chainId, contractAddress);
      alert(t('cw20Guide.alerts.success'));
    } catch (error: any) {
      console.error('Failed to suggest token:', error);

      // Provide specific error messages
      if (error?.message?.includes('Could not establish connection')) {
        alert(t('cw20Guide.alerts.connectionIssue'));
      } else if (error?.message?.includes('not implemented') || error?.message?.includes('not available')) {
        alert(t('cw20Guide.alerts.notSupported'));
      } else {
        alert(t('cw20Guide.alerts.failed'));
      }

      // Show manual guide
      setShowGuide(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('cw20Guide.alerts.copied') + text);
  };

  if (!walletInfo) {
    return null;
  }

  return (
    <div className={`cw20-guide-container ${className}`}>
      <div className="guide-header">
        <h3>{t('cw20Guide.title')}</h3>
        <p>{t('cw20Guide.description')}</p>
      </div>

      <div className="quick-add-section">
        <button
          onClick={addTokenToKeplr}
          className="add-token-button"
        >
          {t('cw20Guide.autoAddButton')}
        </button>
      </div>

      {showGuide && (
        <div className="manual-guide">
          <h4>{t('cw20Guide.manualInstructions')}</h4>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <p>{t('cw20Guide.step1')}</p>
              </div>
            </div>

            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <p>{t('cw20Guide.step2')}</p>
              </div>
            </div>

            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <p>{t('cw20Guide.step3')}</p>
                <div className="token-details">
                  <div className="detail-item">
                    <label>Contract Address:</label>
                    <div className="copy-field">
                      <code>{contractAddress}</code>
                      <button
                        onClick={() => copyToClipboard(contractAddress)}
                        className="copy-button"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Token Name:</label>
                    <div className="copy-field">
                      <code>MSTBL</code>
                      <button
                        onClick={() => copyToClipboard('MSTBL')}
                        className="copy-button"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Symbol:</label>
                    <div className="copy-field">
                      <code>MSTBL</code>
                      <button
                        onClick={() => copyToClipboard('MSTBL')}
                        className="copy-button"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Decimals:</label>
                    <div className="copy-field">
                      <code>6</code>
                      <button
                        onClick={() => copyToClipboard('6')}
                        className="copy-button"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <span className="step-number">4</span>
              <div className="step-content">
                <p>{t('cw20Guide.step4')}</p>
              </div>
            </div>
          </div>

          <div className="guide-note">
            <p>
              {t('cw20Guide.importantNote')}
            </p>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>{t('cw20Guide.usefulInfo.title')}</h4>
        <ul>
          <li>{t('cw20Guide.usefulInfo.nativeToken')}</li>
          <li>{t('cw20Guide.usefulInfo.cw20Token')}</li>
          <li>{t('cw20Guide.usefulInfo.bothImportant')}</li>
        </ul>
      </div>

      <style jsx>{`
        .cw20-guide-container {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 24px;
          margin: 16px 0;
        }

        .guide-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .guide-header h3 {
          color: #495057;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .guide-header p {
          color: #6c757d;
          margin: 0;
          font-size: 14px;
        }

        .quick-add-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .add-token-button {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .add-token-button:hover {
          transform: translateY(-2px);
        }

        .manual-guide {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          border: 1px solid #dee2e6;
        }

        .manual-guide h4 {
          color: #495057;
          margin: 0 0 16px 0;
        }

        .steps {
          margin-bottom: 20px;
        }

        .step {
          display: flex;
          margin-bottom: 16px;
          align-items: flex-start;
        }

        .step-number {
          background: #007bff;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-left: 12px;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
        }

        .step-content p {
          margin: 0 0 8px 0;
          color: #495057;
        }

        .token-details {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
        }

        .detail-item {
          margin-bottom: 8px;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-item label {
          display: block;
          font-weight: bold;
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .copy-field {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 6px 8px;
        }

        .copy-field code {
          flex: 1;
          background: none;
          border: none;
          font-family: monospace;
          font-size: 13px;
          color: #495057;
        }

        .copy-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 12px;
        }

        .copy-button:hover {
          background: #e9ecef;
        }

        .guide-note {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 12px;
          margin-top: 16px;
        }

        .guide-note p {
          margin: 0;
          font-size: 13px;
          color: #856404;
        }

        .info-box {
          background: #e7f3ff;
          border: 1px solid #b8daff;
          border-radius: 8px;
          padding: 16px;
          margin-top: 20px;
        }

        .info-box h4 {
          color: #004085;
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .info-box ul {
          margin: 0;
          padding-right: 20px;
          color: #004085;
        }

        .info-box li {
          margin-bottom: 4px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .cw20-guide-container {
            padding: 16px;
          }

          .copy-field {
            flex-direction: column;
            align-items: stretch;
          }

          .copy-button {
            margin-top: 4px;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default CW20TokenGuide;
