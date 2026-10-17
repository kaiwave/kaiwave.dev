import { Gabarito } from 'next/font/google';
import Boing from '@/components/Boing';
import Pucks from '@/components/Pucks';
import Reveal from '@/components/Reveal';
import './globals.css';

const font = Gabarito({ subsets: ['latin'], weight: 'variable', variable: '--font' });

export const metadata = {
  metadataBase: new URL('https://kaiwave.dev'),
  title: { default: 'Malakai Harianto, kaiwave', template: '%s, kaiwave' },
  description:
    'Mathematical physics undergraduate at the University of Melbourne, building models of hockey goalies, NBA defences and fantasy football.',
  icons: { icon: '/img/favicon.png' },
};

export const viewport = { themeColor: '#111214', colorScheme: 'dark' };

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={font.variable}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <Reveal />
        <Boing />
        <Pucks />
      </body>
    </html>
  );
}
