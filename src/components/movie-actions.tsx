
'use client';

import { Button } from '@/components/ui/button';
import { Download, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function handleGenerateLink(movieId: string, link: string) {
  const domain = "https://www.aimlinfo.in"
  const url = link.split("https://gigody.com/?id=")[1]
  const finalLink = `${domain}/?ywegkqdsfljsaldfjlsdkfjlsadjfoiwueroiuxkvck=${movieId}---${url}---${movieId}`
  return finalLink
}

export function StreamOnline({ link, movieId }: { link: string; movieId: string }) {
  const router = useRouter()
  if (!link) {
    return (
      <Button size="lg" disabled>
        <PlayCircle className="mr-2" /> Not Available
      </Button>
    );
  }
  return (
    <Button onClick={() => router.push(handleGenerateLink(movieId, link))} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
      <PlayCircle className="mr-2" /> Stream Online
    </Button>
  );
}

export function DownloadLinks({ links, movieId }: { links: { [key: string]: string } | undefined, movieId: string }) {
  const router = useRouter()
  if (!links || Object.keys(links).length === 0) {
    return (
      <p className="text-muted-foreground italic">No download links available.</p>
    );
  }

  const sortedLinks = Object.entries(links).sort((a, b) => {
    const qualityA = parseInt(a[0].replace('p', ''));
    const qualityB = parseInt(b[0].replace('p', ''));
    return qualityB - qualityA;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {sortedLinks.map(([quality, link]) => (
        <Button key={quality} onClick={() => router.push(handleGenerateLink(movieId, link))} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <PlayCircle className="mr-2" /> Stream Online
      </Button>
      ))}
    </div>
  );
}

