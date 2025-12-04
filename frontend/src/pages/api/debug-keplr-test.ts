import type { NextApiRequest, NextApiResponse } from 'next';

interface ChainConfig {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: Array<{
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  }>;
  feeCurrencies: Array<{
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    gasPriceStep: {
      low: number;
      average: number;
      high: number;
    };
  }>;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
  coinType: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test function to get environment variables (exactly like useKeplr.ts)
    const getEnvVar = (key: string, defaultValue: string): string => {
      return process.env[key] || defaultValue;
    };

    // Build the chain config exactly like useKeplr.ts does
    const MSTBL_CHAIN_INFO: ChainConfig = {
      chainId: getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'mstbl-1'),
      chainName: 'MSTBL Network',
      rpc: getEnvVar('NEXT_PUBLIC_RPC_ENDPOINT', 'http://34.57.32.80:26657'),
      rest: getEnvVar('NEXT_PUBLIC_REST_ENDPOINT', 'http://34.57.32.80:1317'),
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

    // Test RPC connectivity
    let rpcTest = null;
    try {
      const rpcResponse = await fetch(`${MSTBL_CHAIN_INFO.rpc}/status`);
      const rpcData = await rpcResponse.json();
      rpcTest = {
        accessible: true,
        chainId: rpcData.result?.node_info?.network,
        moniker: rpcData.result?.node_info?.moniker
      };
    } catch (error) {
      rpcTest = {
        accessible: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Test REST connectivity
    let restTest = null;
    try {
      const restResponse = await fetch(`${MSTBL_CHAIN_INFO.rest}/cosmos/base/tendermint/v1beta1/node_info`);
      const restData = await restResponse.json();
      restTest = {
        accessible: true,
        chainId: restData.default_node_info?.network,
        appName: restData.application_version?.name
      };
    } catch (error) {
      restTest = {
        accessible: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Test validator query to confirm bech32 format
    let validatorTest = null;
    try {
      const validatorResponse = await fetch(`${MSTBL_CHAIN_INFO.rest}/cosmos/staking/v1beta1/validators?pagination.limit=1`);
      const validatorData = await validatorResponse.json();
      const firstValidator = validatorData.validators?.[0];
      if (firstValidator?.operator_address) {
        const prefix = firstValidator.operator_address.slice(0, firstValidator.operator_address.indexOf('1'));
        validatorTest = {
          accessible: true,
          detectedPrefix: prefix,
          expectedPrefix: MSTBL_CHAIN_INFO.bech32Config.bech32PrefixValAddr,
          prefixMatch: prefix === MSTBL_CHAIN_INFO.bech32Config.bech32PrefixValAddr.replace('valoper', '') + 'valoper'
        };
      }
    } catch (error) {
      validatorTest = {
        accessible: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Environment variable debugging
    const envVars = Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC'))
      .reduce((acc, key) => {
        acc[key] = process.env[key];
        return acc;
      }, {} as Record<string, string | undefined>);

    const response = {
      message: 'MSTBL Keplr Configuration Test',
      timestamp: new Date().toISOString(),
      chainConfig: MSTBL_CHAIN_INFO,
      environmentVariables: envVars,
      connectivityTests: {
        rpc: rpcTest,
        rest: restTest,
        validator: validatorTest
      },
      getEnvVarResults: {
        CHAIN_ID: getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'mstbl-1'),
        BECH32_PREFIX: getEnvVar('NEXT_PUBLIC_BECH32_PREFIX', 'wasm'),
        RPC_ENDPOINT: getEnvVar('NEXT_PUBLIC_RPC_ENDPOINT', 'https://rpc.stbl.mstbl.com'),
        REST_ENDPOINT: getEnvVar('NEXT_PUBLIC_REST_ENDPOINT', 'https://api.stbl.mstbl.com'),
        COIN_DENOM: getEnvVar('NEXT_PUBLIC_COIN_DENOM', 'stake')
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Debug test error:', error);
    res.status(500).json({
      error: 'Debug test failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
