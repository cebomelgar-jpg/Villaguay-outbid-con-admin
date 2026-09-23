'use client';

import { motion } from 'framer-motion';
import { Crown, Swords, MessageCircle, Instagram, MapPin, Clock, Eye } from 'lucide-react';
import { type Business, formatARS, MIN_INCREMENT } from '@/lib/mockData';
import { incrementBusinessClick } from '@/lib/store';

interface LeaderCardProps {
  business: Business;
  onOutbid: (business: Business) => void;
}

export function LeaderCard({ business, onOutbid }: LeaderCardProps) {
  const suggestedBid = business.bid + MIN_INCREMENT;

  const handleClick = () => {
    incrementBusinessClick(business.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full animate-pulse-gold rounded-2xl overflow-hidden"
    >
      <div className="rounded-2xl bg-gradient-to-br from-neon-gold/30 via-neon-gold/10 to-neon-gold/30 p-[2px]">
        <div className="rounded-2xl bg-panel/80 backdrop-blur-xl overflow-hidden">
          <div className="relative h-48 sm:h-64 overflow-hidden">
            <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/60 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-gold/20 backdrop-blur-md border border-neon-gold/50">
              <Crown className="h-4 w-4 text-neon-gold" />
              <span className="text-xs font-display font-bold text-neon-gold tracking-wide">LÍDER DE VILLAGUAY</span>
            </div>
            {business.daysAtTop > 0 && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <Clock className="h-3.5 w-3.5 text-neon-gold" />
                <span className="text-xs font-body text-neon-gold font-semibold">{business.daysAtTop}d reinando</span>
              </div>
            )}
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold shimmer-gold leading-tight">{business.name}</h2>
              <p className="text-sm text-muted-foreground font-body mt-1">{business.slogan}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-body">
              <span className="flex items-center gap-1"><span className="text-neon-green">●</span> {business.owner}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {business.address}</span>
            </div>
            <div className="flex items-end justify-between gap-4 pt-2 border-t border-white/5">
              <div>
                <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Puja Actual</span>
                <div className="font-display text-3xl sm:text-4xl font-bold neon-text-gold leading-none mt-1">{formatARS(business.bid)}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Reino Actual</span>
                <span className="text-sm font-display font-bold text-neon-gold mt-1">#1 RANKING</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/30">
                <Eye className="h-3.5 w-3.5 text-neon-purple" />
                <span className="text-xs font-body text-neon-purple font-semibold">{business.clickCount} clics</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => onOutbid(business)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all"
              >
                <Swords className="h-4 w-4" />
                DESTRONAR POR {formatARS(suggestedBid)}
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="flex items-center gap-2 px-3 py-2 rounded-lg glass-panel-hover text-xs font-body text-neon-green hover:text-neon-green">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="flex items-center gap-2 px-3 py-2 rounded-lg glass-panel-hover text-xs font-body text-neon-purple hover:text-neon-purple">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
