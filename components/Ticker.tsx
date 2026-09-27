'use client';

import { type LiveEvent } from '@/lib/mockData';

interface TickerProps {
  events: LiveEvent[];
}

export function Ticker({ events }: TickerProps) {
  const items = [...events, ...events];

  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-black/40 backdrop-blur-sm py-2.5">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {items.map((event, index) => (
          <span
            key={`${event.id}-${index}`}
            className="text-xs sm:text-sm font-body text-muted-foreground flex items-center gap-2"
          >
            <span className="text-neon-green font-semibold">{event.message}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground/70">{event.timeAgo}</span>
            <span className="text-muted-foreground/30 ml-4">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
