import type { NextApiRequest, NextApiResponse } from 'next';

type HealthData = {
  status: string;
  timestamp: string;
  environment: string;
  version: string;
  chain?: {
    id: string;
    rpc: string;
    status: string;
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthData>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const healthData: HealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0',
      chain: {
        id: process.env.NEXT_PUBLIC_CHAIN_ID || 'stbl-1',
        rpc: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'http://localhost:26657',
        status: 'connected', // In a real app, you'd actually check the chain status
      },
    };

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(healthData);
  } catch (error) {
    const errorData: HealthData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0',
    };

    res.status(503).json(errorData);
  }
}
