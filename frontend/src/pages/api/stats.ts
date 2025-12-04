import type { NextApiRequest, NextApiResponse } from 'next';

export type StatsData = {
  totalSupply: number;
  currentStage: number;
  stagePrice: number;
  nextStagePrice: number;
  tokensRemaining: number;
  totalSold: number;
  allocation: {
    reserve: {
      amount: number;
      percentage: number;
      purpose: string;
    };
    marketing: {
      amount: number;
      percentage: number;
      purpose: string;
    };
    treasury: {
      amount: number;
      percentage: number;
      purpose: string;
    };
  };
  stages: Array<{
    stage: number;
    tokens: number;
    price: number;
    status: 'active' | 'upcoming' | 'completed';
  }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsData | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Here we would normally query the blockchain for live data
    // For now, returning static data based on the MSTBL tokenomics
    const statsData: StatsData = {
      totalSupply: 1000000, // 1 million MSTBL (not 1.1M)
      currentStage: 1,
      stagePrice: 1.00, // Current stage price in USDC
      nextStagePrice: 10.00, // Next stage price
      tokensRemaining: 250000, // Tokens remaining in current stage
      totalSold: 0, // Total tokens sold so far

      allocation: {
        reserve: {
          amount: 1000000,
          percentage: 100,
          purpose: 'Public sale (4 stages)'
        },
        marketing: {
          amount: 0,
          percentage: 0,
          purpose: 'No marketing allocation'
        },
        treasury: {
          amount: 0,
          percentage: 0,
          purpose: 'Governance & future expansion'
        }
      },

      stages: [
        {
          stage: 1,
          tokens: 250000,
          price: 1.00,
          status: 'active'
        },
        {
          stage: 2,
          tokens: 250000,
          price: 10.00,
          status: 'upcoming'
        },
        {
          stage: 3,
          tokens: 250000,
          price: 100.00,
          status: 'upcoming'
        },
        {
          stage: 4,
          tokens: 250000,
          price: 1000.00,
          status: 'upcoming'
        }
      ]
    };

    res.status(200).json(statsData);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
