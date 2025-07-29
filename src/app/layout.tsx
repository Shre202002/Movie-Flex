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
    <head>
    <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N83HSEGNXB"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N83HSEGNXB');
          `}
        </Script>
        <meta name="google-site-verification" content="qWN3H03gG_jD05HDPMqs6ufNHvB5sCerW9kS6-5Ze5Q" />
    </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <Script
          src="//powderencouraged.com/1b/36/cc/1b36cc294dbb38e45b40365d140a128c.js"
          strategy="afterInteractive"
        />
        <Script
          src="//powderencouraged.com/da/11/d7/da11d78c472c36e22115058e17315051.js"
          strategy="afterInteractive"
        />
        
        <Script
          src="//powderencouraged.com/4dd88bdfb50ac5869a799bbd41c331f1/invoke.js"
          strategy="afterInteractive"
          data-cfasync="false"
          async
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
