import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app'; // Import the AppProps type
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
