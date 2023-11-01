import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { MusicProvider } from '../music/musicProvider';

export default function App({ Component, pageProps }: AppProps) {
  return <MusicProvider>
    <Component {...pageProps} />
  </MusicProvider >
}
