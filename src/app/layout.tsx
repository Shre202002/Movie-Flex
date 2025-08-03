
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import NextProgressBar from '@/components/progress-bar';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import { getMovieSiteLink } from '@/lib/data';


const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'All Movies Download - Download & Stream Movies for Free',
  description: 'Explore and download a vast collection of the latest and classic movies for free. Search by genre, year, or actor to find your next favorite film and stream it online.',
  keywords: ['movies', 'download movies', 'free movies', 'stream movies', 'latest movies', 'hollywood', 'bollywood'],
  openGraph: {
    title: 'All Movies Download - Download & Stream Movies for Free',
    description: 'Explore and download a vast collection of the latest and classic movies for free.',
    url: await getMovieSiteLink(),
    siteName: 'All Movies Download',
    images: [
      {
        url: '/Movie_Studio_30032.ico',
        width: 1000,
        height: 1000,
        alt: 'All Movies Download Homepage',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Movies Download - Download & Stream Movies for Free',
    description: 'Explore and download a vast collection of the latest and classic movies for free.',
    images: ['/Movie_Studio_30032.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="qWN3H03gG_jD05HDPMqs6ufNHvB5sCerW9kS6-5Ze5Q" />
        {/* <Script src="/popup2.js" strategy="afterInteractive" /> */}
        {/* <Script src="/ads-prebid-wp-banner.js" strategy="afterInteractive" /> */}
        {/* <Script src="/adblockDetector.js" strategy="afterInteractive" /> */}
      </head>
      
      <body
        suppressHydrationWarning={true}
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <Script
          id="gtag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-N83HSEGNXB"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N83HSEGNXB');
          `}
        </Script>
        <Script
          id="ad-script-1"
          src="//powderencouraged.com/1b/36/cc/1b36cc294dbb38e45b40365d140a128c.js"
          strategy="afterInteractive"
        />
        <Script
          id="ad-script-2"
          src="//powderencouraged.com/da/11/d7/da11d78c472c36e22115058e17315051.js"
          strategy="afterInteractive"
        />

        <Script
          id="ad-script-3"
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
