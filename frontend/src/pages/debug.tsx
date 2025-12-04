import { useState } from 'react';

export default function DebugPage() {
  const [config, setConfig] = useState<any>(null);
  const [keplrConfig, setKeplrConfig] = useState<any>(null);

  const checkConfig = () => {
    // Check what the getEnvVar function returns
    const getEnvVar = (key: string, defaultValue: string) => {
      return process.env[key] || defaultValue;
    };

    const clientConfig = {
      NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || 'not-set',
      NEXT_PUBLIC_BECH32_PREFIX: process.env.NEXT_PUBLIC_BECH32_PREFIX || 'not-set',
      NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'not-set',
      getEnvVar_BECH32: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm'),
      raw_process_env: typeof process !== 'undefined' ? Object.keys(process.env || {}).filter(k => k.startsWith('NEXT_PUBLIC')) : 'process not available',
    };

    setConfig(clientConfig);

    // Also check what MSTBL_CHAIN_INFO would be
    try {
      const MSTBL_CHAIN_INFO = {
        chainId: getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'mstbl-1'),
        chainName: 'MSTBL Network',
        rpc: getEnvVar('NEXT_PUBLIC_RPC_ENDPOINT', 'https://rpc.stbl.mstbl.com'),
        rest: getEnvVar('NEXT_PUBLIC_REST_ENDPOINT', 'https://api.stbl.mstbl.com'),
        bech32Config: {
          bech32PrefixAccAddr: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm'),
          bech32PrefixAccPub: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'pub',
          bech32PrefixValAddr: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valoper',
          bech32PrefixValPub: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valoperpub',
          bech32PrefixConsAddr: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valcons',
          bech32PrefixConsPub: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm') + 'valconspub',
        },
        currencies: [
          {
            coinDenom: 'STAKE',
            coinMinimalDenom: 'stake',
            coinDecimals: 0,
          },
          {
            coinDenom: 'MSTBL',
            coinMinimalDenom: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'mstbl'),
            coinDecimals: 6,
          }
        ],
        feeCurrencies: [
          {
            coinDenom: 'MSTBL',
            coinMinimalDenom: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'mstbl'),
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.04,
            },
          }
        ],
        stakeCurrency: {
          coinDenom: 'STAKE',
          coinMinimalDenom: 'stake',
          coinDecimals: 0,
        },
        coinType: 118,
      };

      setKeplrConfig(MSTBL_CHAIN_INFO);
    } catch (error) {
      setKeplrConfig({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>MSTBL Client-Side Config Debug</h1>

      <button onClick={checkConfig} style={{ padding: '10px', marginBottom: '20px' }}>
        Check Configuration
      </button>

      {config && (
        <div>
          <h2>Client-Side Environment Variables:</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}

      {keplrConfig && (
        <div>
          <h2>Generated Keplr Configuration:</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(keplrConfig, null, 2)}
          </pre>
          <p><strong>Bech32 Prefix:</strong> {keplrConfig.bech32Config?.bech32PrefixAccAddr || 'Not found'}</p>
        </div>
      )}
    </div>
  );
}
