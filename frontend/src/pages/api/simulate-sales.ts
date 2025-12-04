import type { NextApiRequest, NextApiResponse } from 'next';

let simulatedSales = 0; // Reset to 0 - no tokens sold yet

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Simulate a token sale
    const { amount } = req.body;
    const tokensToSell = parseInt(amount) || 1000;

    simulatedSales += tokensToSell;

    res.status(200).json({
      success: true,
      newTotalSold: simulatedSales,
      tokensSold: tokensToSell,
      message: `Sold ${tokensToSell.toLocaleString()} tokens. Total sold: ${simulatedSales.toLocaleString()}`
    });

  } else if (req.method === 'GET') {
    // Get current simulated sales
    res.status(200).json({
      totalSold: simulatedSales
    });

  } else if (req.method === 'DELETE') {
    // Reset simulation
    simulatedSales = 0;
    res.status(200).json({
      success: true,
      message: 'Sales simulation reset'
    });

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
