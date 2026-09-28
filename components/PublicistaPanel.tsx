'use client';

import { useState, useEffect } from 'react';
import { Trophy, Copy, Share2, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { getPublicistaByRefKey } from '@/lib/referral-service';

interface PublicistaPanelProps {
  refKey: string;
}

export function PublicistaPanel({ refKey }: PublicistaPanelProps) {
  const [publicista, setPublicista] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicista() {
      setLoading(true);
      const data = await getPublicistaByRefKey(refKey);
      setPublicista(data);
      setLoading(false);
    }
    
    if (refKey) {
      loadPublicista();
    }
  }, [refKey]);

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-4 border border-neon-gold/20">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-gold/15"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neon-gold/15 rounded w-3/4"></div>
            <div className="h-3 bg-neon-gold/10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!publicista) {
    return null;
  }

  const copyReferralLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://villaguayoutbid.netlify.app';
    const referralLink = `${baseUrl}/?ref=${publicista.ref_key}`;
    
    navigator.clipboard.writeText(referralLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const shareOnWhatsApp = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://villaguayoutbid.netlify.app';
    const referralLink = `${baseUrl}/?ref=${publicista.ref_key}`;
    const message = `¡Sumate a Villaguay Outbid! Accedé al ranking más competitivo de comercios: ${referralLink}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-neon-gold/20 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-neon-gold" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-display font-bold text-foreground">{publicista.nombre_publico}</p>
          <p className="text-xs text-muted-foreground font-body">Panel de Publicista</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="glass-panel rounded-lg p-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3.5 w-3.5 text-neon-gold" />
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Puntos</p>
          </div>
          <p className="text-lg font-display font-bold text-neon-gold">{publicista.puntos_mes_actual}</p>
        </div>
        <div className="glass-panel rounded-lg p-2.5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-neon-purple" />
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Tendencia</p>
          </div>
          <p className="text-lg font-display font-bold text-neon-purple">🔥</p>
        </div>
      </div>

      <div className="glass-panel rounded-lg p-2.5">
        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-1">
          Tu enlace único
        </p>
        <p className="text-xs font-mono text-neon-gold break-all">
          {typeof window !== 'undefined' ? window.location.origin : 'https://villaguayoutbid.netlify.app'}/?ref={publicista.ref_key}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyReferralLink}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg glass-panel-hover font-body text-xs font-medium text-foreground hover:text-neon-gold transition-colors"
        >
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </button>
        <button
          onClick={shareOnWhatsApp}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neon-green/15 border border-neon-green/40 text-neon-green font-body text-xs font-medium hover:bg-neon-green/25 transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}