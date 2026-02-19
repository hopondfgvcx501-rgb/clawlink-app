import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://www.clawlink.com'),
  title: {
    default: 'ClawLink | One-Click AI Agent Deployment',
    template: '%s | ClawLink'
  },
  description: 'Deploy your own 24/7 active AI Agent under 1 minute. ClawLink combines speed and reliability for Telegram, Discord, and more.',
  keywords: 'ClawLink, AI Automation, Telegram Bot, AI Agent Deployment, OpenClaw',
  openGraph: {
    title: 'ClawLink AI Automation',
    description: 'Autonomous AI Agent Orchestration Systems. Deploy instantly.',
    url: 'https://www.clawlink.com',
    siteName: 'ClawLink',
    images: [{ url: '/og-image.png' }],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}