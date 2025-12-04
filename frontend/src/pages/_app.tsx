import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import '@/styles/globals.css';
import '@/utils/errorFilter'; // Suppress known Keplr extension errors

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/MSTBL_LOGO.png" type="image/png" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/MSTBL_LOGO.png" />
        <title>MSTBL - Million Stable Coin Network</title>
        <meta name="description" content="MSTBL Million Stable Coin - The future of stable cryptocurrency on Cosmos" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App);
