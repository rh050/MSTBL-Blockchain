import type { NextApiRequest, NextApiResponse } from 'next';

interface WalletBalance {
  address: string;
  name: string;
  stake: string;
  mstbl?: string;
  status: 'active' | 'empty' | 'error';
}

interface SystemStatus {
  chainInfo: {
    chainId: string;
    blockHeight: string;
    nodeInfo: any;
  };
  mstblContract: {
    address: string;
    totalSupply: string;
    name: string;
    symbol: string;
  };
  wallets: WalletBalance[];
  lastUpdated: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const MSTBL_CONTRACT = process.env.NEXT_PUBLIC_MSTBL_CONTRACT || 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrss5maay';
    const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.stbl.mstbl.com';
    const REST_ENDPOINT = process.env.NEXT_PUBLIC_REST_ENDPOINT || 'https://api.stbl.mstbl.com';

    // Get chain info
    const statusResponse = await fetch(`${RPC_ENDPOINT}/status`);
    const statusData = await statusResponse.json();

    const nodeInfoResponse = await fetch(`${REST_ENDPOINT}/cosmos/base/tendermint/v1beta1/node_info`);
    const nodeInfoData = await nodeInfoResponse.json();

    // Get MSTBL contract info
    const contractResponse = await fetch(
      `${REST_ENDPOINT}/cosmwasm/wasm/v1/contract/${MSTBL_CONTRACT}/smart/eyJ0b2tlbl9pbmZvIjp7fX0=`
    );
    const contractData = await contractResponse.json();

    // Format total supply
    const totalSupply = contractData.data?.total_supply || '0';
    const formattedSupply = (parseInt(totalSupply) / Math.pow(10, 6)).toLocaleString('he-IL');

    // Define wallets to check
    const walletsToCheck = [
      {
        address: 'wasm1re0pq3tyrtfen6mmjzdtpays46ssp7kdx3vptp',
        name: '🏛️ Creator/Admin'
      },
      {
        address: 'wasm18a47g3qfrknlyuwra02tr4n4g5dq6h2fq3ss7j',
        name: '🛡️ Contract Admin'
      },
      {
        address: 'wasm15vmmdfsalwkg9ndscwy9kxzffpqwtlxfpf9y5j',
        name: '🟢 Reserve Wallet'
      },
      {
        address: 'wasm1aakfpghcanxtc45gpqlx8j3rq0zcpyf49qmhm9mdjrfx036h4z5se0hfnq',
        name: '🏦 Treasury Contract'
      }
    ];

    // Check each wallet balance
    const wallets: WalletBalance[] = await Promise.all(
      walletsToCheck.map(async (wallet) => {
        try {
          const balanceResponse = await fetch(
            `${REST_ENDPOINT}/cosmos/bank/v1beta1/balances/${wallet.address}`
          );
          const balanceData = await balanceResponse.json();

          const stakeBalance = balanceData.balances?.find((b: any) => b.denom === 'stake');
          const stakeAmount = stakeBalance ?
            (parseInt(stakeBalance.amount) / Math.pow(10, 6)).toLocaleString('he-IL') + ' מיליון' :
            '0';

          // Determine status
          let status: 'active' | 'empty' | 'error' = 'empty';
          if (balanceData.balances && balanceData.balances.length > 0) {
            const hasBalance = balanceData.balances.some((b: any) => parseInt(b.amount) > 0);
            status = hasBalance ? 'active' : 'empty';
          }

          return {
            address: wallet.address,
            name: wallet.name,
            stake: stakeAmount,
            status
          };
        } catch (error) {
          return {
            address: wallet.address,
            name: wallet.name,
            stake: 'Error',
            status: 'error' as const
          };
        }
      })
    );

    const systemStatus: SystemStatus = {
      chainInfo: {
        chainId: statusData.result?.node_info?.network || 'unknown',
        blockHeight: statusData.result?.sync_info?.latest_block_height || 'unknown',
        nodeInfo: nodeInfoData.default_node_info
      },
      mstblContract: {
        address: MSTBL_CONTRACT,
        totalSupply: formattedSupply,
        name: contractData.data?.name || 'Unknown',
        symbol: contractData.data?.symbol || 'Unknown'
      },
      wallets,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(systemStatus);
  } catch (error) {
    console.error('Live status error:', error);
    res.status(500).json({
      error: 'Failed to fetch live status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
