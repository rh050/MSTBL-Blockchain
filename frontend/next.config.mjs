/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // i18n Configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he', 'ar', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'ru', 'pt', 'it'],
  },

  // PWA Configuration
  async headers() {
    const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'http://localhost:26657';
    const restEndpoint = process.env.NEXT_PUBLIC_REST_ENDPOINT || 'http://localhost:1317';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://flagcdn.com https://cdn.jsdelivr.net; connect-src 'self' ${rpcEndpoint} ${restEndpoint} ws://localhost:3000; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`,
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || 'mstbl-1',
    NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.stbl.mstbl.com',
    NEXT_PUBLIC_REST_ENDPOINT: process.env.NEXT_PUBLIC_REST_ENDPOINT || 'https://api.stbl.mstbl.com',
    NEXT_PUBLIC_BECH32_PREFIX: process.env.NEXT_PUBLIC_BECH32_PREFIX || 'wasm',
    NEXT_PUBLIC_COIN_DENOM: process.env.NEXT_PUBLIC_COIN_DENOM || 'umstbl',
    NEXT_PUBLIC_COIN_DECIMALS: process.env.NEXT_PUBLIC_COIN_DECIMALS || '6',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'MSTBL Progressive Sale',
    NEXT_PUBLIC_RESERVE_WALLET: process.env.NEXT_PUBLIC_RESERVE_WALLET || '',
    NEXT_PUBLIC_SALE_WALLET: process.env.NEXT_PUBLIC_SALE_WALLET || '',
    NEXT_PUBLIC_ADMIN_TREASURY_USDC: process.env.NEXT_PUBLIC_ADMIN_TREASURY_USDC || '',
    NEXT_PUBLIC_CURRENT_PHASE: process.env.NEXT_PUBLIC_CURRENT_PHASE || '1',
    NEXT_PUBLIC_TOKENS_PER_PHASE: process.env.NEXT_PUBLIC_TOKENS_PER_PHASE || '250000',
  },

  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration for Docker deployment
  output: 'standalone',

  // Disable strict mode for production stability
  reactStrictMode: false,

  // Image optimization
  images: {
    domains: ['flagcdn.com', 'cdn.jsdelivr.net'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
