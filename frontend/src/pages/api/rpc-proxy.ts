import type { NextApiRequest, NextApiResponse } from 'next';

// RPC Proxy to avoid CORS issues
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== 'POST' && method !== 'GET' && method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.stbl.mstbl.com';
    const path = req.query.path as string || 'status';

    // Clean CORS headers - set only once
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
      return res.status(200).end();
    }

    const url = `${rpcEndpoint}/${path}`;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Add mode: 'no-cors' to bypass CORS checks
    const corsOptions: RequestInit = {
      ...fetchOptions,
      mode: 'cors', // We handle CORS ourselves
    };

    const response = await fetch(url, corsOptions);

    if (!response.ok) {
      console.error(`RPC request failed: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: 'RPC request failed',
        status: response.status,
        statusText: response.statusText
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      const text = await response.text();
      return res.status(200).send(text);
    }

  } catch (error) {
    console.error('RPC proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
