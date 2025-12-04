import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_BECH32_PREFIX: process.env.NEXT_PUBLIC_BECH32_PREFIX,
    NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
    NEXT_PUBLIC_REST_ENDPOINT: process.env.NEXT_PUBLIC_REST_ENDPOINT,
    NEXT_PUBLIC_COIN_DENOM: process.env.NEXT_PUBLIC_COIN_DENOM,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_MSTBL_CONTRACT: process.env.NEXT_PUBLIC_MSTBL_CONTRACT,
    NEXT_PUBLIC_RESERVE_WALLET: process.env.NEXT_PUBLIC_RESERVE_WALLET,
    NEXT_PUBLIC_SALE_WALLET: process.env.NEXT_PUBLIC_SALE_WALLET,
    NODE_ENV: process.env.NODE_ENV,
  };

  res.status(200).json({
    message: 'MSTBL Configuration Debug',
    config,
    timestamp: new Date().toISOString(),
  });
}
