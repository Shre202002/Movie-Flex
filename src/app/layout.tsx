import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import NextProgressBar from '@/components/progress-bar';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';
import Script from 'next/script';


const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'All Movies Download',
  description: 'A modern movie listing website built with Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <Script
          src="//pl27280340.profitableratecpm.com/1b/36/cc/1b36cc294dbb38e45b40365d140a128c.js"
          strategy="afterInteractive"
        />
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
        <Toaster />
        <NextProgressBar />
      </body>
    </html>
  );
}
