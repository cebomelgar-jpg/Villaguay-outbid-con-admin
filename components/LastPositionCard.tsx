'use client';

import { motion } from 'framer-motion';
import { Tag, Plus } from 'lucide-react';
import { formatARS, MIN_BID } from '@/lib/mockData';

interface LastPositionCardProps {
  onJoin: () => void;
  currentLowestBid: number;
  discount: number;
}

export function LastPositionCard({ onJoin, currentLowestBid, discount }: LastPositionCardProps) {
  const discountedPrice = Math.max(MIN_BID, Math.round(currentLowestBid * (discount / 100)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-panel rounded-2xl p-6 border border-neon-gold/30 bg-gradient-to-br from-neon-gold/10 to-neon-gold/5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-neon-gold/20 border border-neon-gold/50 flex items-center justify-center">
          <Tag className="h-6 w-6 text-neon-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Sumarse al Último Puesto</h3>
          <p className="text-xs text-muted-foreground font-body">Oferta especial para nuevos comercios</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground font-body">Precio normal:</span>
          <span className="text-sm font-body text-muted-foreground line-through">{formatARS(currentLowestBid)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-body text-neon-gold font-semibold">Precio con {discount}% OFF:</span>
          <span className="text-xl font-display font-bold text-neon-gold">{formatARS(discountedPrice)}</span>
        </div>
      </div>

      <button
        onClick={onJoin}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all"
      >
        <Plus className="h-4 w-4" />
        Sumar mi Comercio por {formatARS(discountedPrice)}
      </button>

      <p className="text-[10px] text-muted-foreground/60 font-body text-center mt-3">
        Tu comercio ingresará al último puesto del ranking
      </p>
    </motion.div>
  );
}
