'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, MessageCircle, Send, Award, CheckCircle2, XCircle } from 'lucide-react';
import { type Oficio, medalLabel } from '@/lib/oficiosData';

interface OficioCardProps {
  oficio: Oficio;
  position: number;
  onPresupuesto: (oficio: Oficio) => void;
}

const MEDAL_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  oro: { color: 'text-neon-gold', bg: 'bg-neon-gold/15', border: 'border-neon-gold/50' },
  plata: { color: 'text-slate-300', bg: 'bg-slate-300/15', border: 'border-slate-300/40' },
  bronce: { color: 'text-amber-600', bg: 'bg-amber-600/15', border: 'border-amber-600/40' },
  recomendado: { color: 'text-neon-green', bg: 'bg-neon-green/15', border: 'border-neon-green/40' },
  nuevo: { color: 'text-neon-blue', bg: 'bg-neon-blue/15', border: 'border-neon-blue/40' },
};

export function OficioCard({ oficio, position, onPresupuesto }: OficioCardProps) {
  const medal = MEDAL_STYLES[oficio.medal] ?? MEDAL_STYLES.recomendado;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Hola ${oficio.nickname ?? oficio.name}, te encontré en Villaguay Outbid (Oficios) y quería consultarte.`);
    const url = oficio.whatsapp.includes('?') ? `${oficio.whatsapp}&text=${text}` : `${oficio.whatsapp}?text=${text}`;
    window.open(url, '_blank');
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
      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Posición */}
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-black/30 border border-white/10">
          <span className="font-display text-lg sm:text-xl font-bold text-muted-foreground">#{position}</span>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-base font-bold text-foreground truncate">
                {oficio.name}
              </h3>
              <p className="text-xs text-muted-foreground font-body mt-0.5 truncate">
                {oficio.trade}
              </p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-display font-bold ${medal.bg} ${medal.border} border ${medal.color}`}>
              <Award className="h-3 w-3" />
              {medalLabel(oficio.medal)}
            </span>
          </div>

          {/* Zona + Disponibilidad */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-body">
              <MapPin className="h-3 w-3 text-neon-purple" />
              {oficio.zone}
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-body font-medium ${oficio.available ? 'text-neon-green' : 'text-neon-red'}`}>
              {oficio.available ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {oficio.available ? 'Disponible' : 'Ocupado'}
            </span>
          </div>

          {/* Calificación */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.round(oficio.rating) ? 'text-neon-gold fill-neon-gold' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-body">
              {oficio.rating.toFixed(1)} · {oficio.reviews} reseñas
            </span>
          </div>

          {oficio.bio && (
            <p className="text-[11px] sm:text-xs text-muted-foreground/70 font-body mt-2 line-clamp-2">
              {oficio.bio}
            </p>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 px-3 sm:px-4 pb-3 sm:pb-4">
        <button
          onClick={() => onPresupuesto(oficio)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neon-green/15 border border-neon-green/30 text-neon-green hover:bg-neon-green/25 hover:border-neon-green/50 transition-all text-xs font-display font-bold"
        >
          <Send className="h-3.5 w-3.5" />
          Pedir Presupuesto
        </button>
        <a
          href={oficio.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg glass-panel-hover text-neon-green hover:text-neon-green text-xs font-body font-medium"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </motion.div>
  );
}
