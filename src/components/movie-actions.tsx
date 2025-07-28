
'use client';

import { Button } from '@/components/ui/button';
import { getRandomBlog } from '@/lib/data';
import { Download, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

async function handleGenerateLink(movieId: string, link: string) {
  const domain = await getRandomBlog()
  const url = link.split("https://gigody.com/?id=")[1]
  const finalLink = `${domain}/?ywegkqdsfljsaldfjlsdkfjlsadjfoiwueroiuxkvck=${movieId}--${url}--${movieId}`
  return finalLink;
  // window.open(handleGenerateLink(movieId, link), "_blank")
}

export function StreamOnline({ link, movieId }: { link: string; movieId: string }) {
  const [buttonText, setButtonText] = useState('Stream Online');

  if (!link) {
    return (
      <Button size="lg" disabled>
        <PlayCircle className="mr-2" /> Not Available
      </Button>
    );
  }
  return (
    <Button onClick={async() =>{
      setButtonText("generating...")
      window.open(await handleGenerateLink(movieId, link), "_blank")
      setButtonText("Stream Online")
    }} size="lg" variant="outline">
      <PlayCircle className="mr-2" /> {buttonText}
    </Button>
  );
}


export function DownloadLinks({ links, movieId }: { links: { [key: string]: string } | undefined, movieId: string }) {
  
  if (!links || Object.keys(links).length === 0) {
    return (
      <p className="text-muted-foreground italic">No download links available.</p>
    );
  }

  const sortedLinks = Object.entries(links).sort((a, b) => {
    const qualityA = parseInt(a[0].replace(/[^0-9]/g, ''));
    const qualityB = parseInt(b[0].replace(/[^0-9]/g, ''));
    return qualityB - qualityA;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {sortedLinks.map(([quality, link]) => {
        const [buttonText, setButtonText] = useState(quality);
        return(
          <Button key={quality} onClick={
            async() =>{
              setButtonText("generating...")
              window.open(await handleGenerateLink(movieId, link), "_blank")
              setButtonText(quality)
          }} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="mr-2" /> {buttonText}
        </Button>
        )
      })}
    </div>
  );
}
