import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AuthProvider } from '../providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </AuthProvider>
    </Provider>
  );
} 