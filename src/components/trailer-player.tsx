
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Youtube } from 'lucide-react';
import { useState } from 'react';

interface TrailerPlayerProps {
  trailerId: string | null;
  movieTitle: string;
}

export function TrailerPlayer({ trailerId, movieTitle }: TrailerPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trailerId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Youtube className="mr-2" /> Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{movieTitle} - Trailer</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          {isOpen && (
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
