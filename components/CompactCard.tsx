'use client';

import { motion } from 'framer-motion';
import { Swords, MessageCircle, Instagram, TrendingUp, Eye } from 'lucide-react';
import { type Business, formatARS, MIN_INCREMENT } from '@/lib/mockData';
import { incrementBusinessClick } from '@/lib/store';

interface CompactCardProps {
  business: Business;
  position: number;
  topBid: number;
  onOutbid: (business: Business) => void;
}

export function CompactCard({ business, position, topBid, onOutbid }: CompactCardProps) {
  const diffToTop = topBid - business.bid;
  const suggestedBid = business.bid + MIN_INCREMENT;

  const handleClick = () => {
    incrementBusinessClick(business.id);
  };

  const positionColors: Record<number, string> = {
    2: 'text-slate-300',
    3: 'text-amber-600',
  4: 'text-muted-foreground',
    5: 'text-muted-foreground',
  6: 'text-muted-foreground',
    7: 'text-muted-foreground',
    8: 'text-muted-foreground',
    9: 'text-muted-foreground',
    10: 'text-muted-foreground',
  11: 'text-muted-foreground',
    12: 'text-muted-foreground',
    13: 'text-muted-foreground',
    14: 'text-muted-foreground',
    15: 'text-muted-foreground',
    16: 'text-muted-foreground',
    17: 'text-muted-foreground',
    18: 'text-muted-foreground',
    19: 'text-muted-foreground',
    20: 'text-muted-foreground',
  21: 'text-muted-foreground',
    22: 'text-muted-foreground',
    23: 'text-muted-foreground',
    24: 'text-muted-foreground',
    25: 'text-muted-foreground',
    26: 'text-muted-foreground',
    27: 'text-muted-foreground',
    28: 'text-muted-foreground',
    29: 'text-muted-foreground',
    30: 'text-muted-foreground',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass-panel-hover rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-black/30 border border-white/10">
          <span className={`font-display text-lg sm:text-xl font-bold ${positionColors[position] || 'text-muted-foreground'}`}>#{position}</span>
        </div>
        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
          <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm sm:text-base font-bold text-foreground truncate">{business.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs sm:text-sm font-body text-neon-green font-semibold">{formatARS(business.bid)}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-body flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> {formatARS(diffToTop)} para #1
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20">
              <Eye className="h-2.5 w-2.5 text-neon-purple" />
              <span className="text-[10px] font-body text-neon-purple font-medium">{business.clickCount}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="p-2 rounded-lg glass-panel-hover text-neon-green hover:text-neon-green" title="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="p-2 rounded-lg glass-panel-hover text-neon-purple hover:text-neon-purple" title="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
          <button
            onClick={() => onOutbid(business)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neon-purple/15 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/25 hover:border-neon-purple/50 transition-all text-xs font-display font-bold whitespace-nowrap"
          >
            <Swords className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Superar {formatARS(suggestedBid)}</span>
            <span className="sm:hidden">⚔️</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
