import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import FloatingControls from '@/components/FloatingControls';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'VILLAGUAY OUTBID — Leaderboard Competitivo de Comercios',
  description:
    'La plataforma donde los comercios de Villaguay compiten en tiempo real por el puesto #1. Pujá, destroná y dominá tu categoría.',
  openGraph: {
    title: 'VILLAGUAY OUTBID',
    description:
      'Competí, pujá y conquistá el #1 en el ranking de comercios de Villaguay.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${plusJakarta.variable} dark`}>
      <body className="font-body antialiased min-h-screen">
        <FloatingControls />
        {children}
      </body>
    </html>
  );
}
