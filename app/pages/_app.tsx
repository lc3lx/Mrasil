import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AuthProvider } from '../providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Head>
  <link rel="stylesheet" href="https://unpkg.com/moyasar-payment-form@2.0.16/dist/moyasar.css" />
</Head>
<Component {...pageProps} />
        <Toaster position="top-right" />
      </AuthProvider>
    </Provider>
  );
} 
