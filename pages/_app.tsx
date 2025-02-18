import type { AppProps } from 'next/app';
import { FireSimulationProvider } from '../context/FireSimulationContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FireSimulationProvider>
      <Component {...pageProps} />
    </FireSimulationProvider>
  );
} 