'use client';

import { motion } from 'framer-motion';
import { Crown, Medal, Award, Building2 } from 'lucide-react';
import { type Business, formatARS } from '@/lib/mockData';
import { isSeedBusiness } from '@/src/data/villaguaySeed';
import { getStorePlaceholder, getCategoryPlaceholder } from '@/lib/imageUtils';

interface GlobalLeadersProps {
  businesses: Business[];
  onClaim?: (business: Business) => void;
}

export function GlobalLeaders({ businesses, onClaim }: GlobalLeadersProps) {
  const topBusinesses = [...businesses]
    .sort((a, b) => b.bid - a.bid)
    .slice(0, 3);

  if (topBusinesses.length === 0) return null;

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Crown className="h-6 w-6 text-neon-gold" />;
      case 1:
        return <Medal className="h-5 w-5 text-slate-300" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0:
        return 'border-neon-gold/50 bg-neon-gold/10';
      case 1:
        return 'border-slate-300/50 bg-slate-300/10';
      case 2:
        return 'border-amber-600/50 bg-amber-600/10';
      default:
        return 'border-white/10';
    }
  };

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 0:
        return '🥇 El Rey Comercial de Villaguay';
      case 1:
        return '🥈 Subcampeón';
      case 2:
        return '🥉 Tercer Puesto';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="glass-panel rounded-2xl p-6 border border-neon-gold/20 bg-gradient-to-br from-neon-gold/5 to-transparent">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-neon-gold/20 border border-neon-gold/50 flex items-center justify-center">
            <Crown className="h-6 w-6 text-neon-gold" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold neon-text-gold">Líderes de Villaguay del Mes</h2>
            <p className="text-xs text-muted-foreground font-body">Top 3 comercios con mayor puja global</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`glass-panel rounded-xl p-4 border-2 ${getPositionColor(index)} relative overflow-hidden`}
            >
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {getMedalIcon(index)}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={business.image || getCategoryPlaceholder(business.category, business.name)}
                    alt={business.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryPlaceholder(business.category, business.name);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-1">
                    {getPositionBadge(index)}
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground truncate">{business.name}</h3>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Puja Actual</span>
                  <span className="text-lg font-display font-bold text-neon-gold">{formatARS(business.bid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Días en el #1</span>
                  <span className="text-sm font-body text-foreground">{business.daysAtTop}d</span>
                </div>
              </div>

              {index === 0 && (
                <div className="mt-3 pt-3 border-t border-neon-gold/20">
                  <div className="text-[10px] text-neon-gold font-body font-semibold text-center">
                    ⭐ COMERCIO DESTACADO ⭐
                  </div>
                </div>
              )}

              {isSeedBusiness(business.id) && onClaim && (
                <button
                  onClick={() => onClaim(business)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg glass-panel-hover text-xs font-body text-neon-purple hover:text-neon-purple border border-neon-purple/30"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  ¿Sos el dueño? Reclamá
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
