'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X as XIcon,
  MapPin,
  Clock,
  Phone,
  Instagram,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { isBusinessOpen, formatARS, MERCADO_PAGO_LINK, type Business } from '@/lib/mockData';
import { categories } from '@/lib/mockData';
import { incrementBusinessClick } from '@/lib/store';
import { getCategoryPlaceholder } from '@/lib/imageUtils';

export interface BusinessDetailModalProps {
  business: Business | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  rank?: number;
  onOutbid?: (business: Business) => void;
  onClaim?: (business: Business) => void;
  onPresupuesto?: (business: Business) => void;
}

function galleryFromBusiness(business: Business): string[] {
  const unique: string[] = [];
  const candidates = [
    ...(business.images || []),
    business.image,
  ].filter(Boolean);

  for (const src of candidates) {
    if (!unique.includes(src)) unique.push(src);
  }
  return unique;
}

function whatsappUrl(business: Business): string {
  const raw = business.socialLinks?.whatsapp || business.whatsapp || '';
  if (!raw) return '';
  if (raw.includes('wa.me') || raw.startsWith('http')) return raw;
  return `https://wa.me/${raw.replace(/\D/g, '')}`;
}

function mapsUrl(business: Business): string {
  const explicit = business.socialLinks?.googleMaps || business.googleMaps;
  if (explicit) return explicit;
  const query = encodeURIComponent(`${business.name} ${business.address} Villaguay Entre Ríos`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

const DAY_LABELS: { key: keyof NonNullable<Business['businessHours']>; label: string }[] = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export function BusinessDetailModal({
  business,
  open = true,
  onOpenChange,
  onClose,
  rank,
  onOutbid,
  onClaim,
  onPresupuesto,
}: BusinessDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isVisible = open && !!business;

  // Función unificada para cerrar el modal
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [business?.id]);

  const images = useMemo(() => (business ? galleryFromBusiness(business) : []), [business]);
  const hasImages = images.length > 0;
  const category = business ? categories.find((c) => c.id === business.category) : undefined;
  const isOpenNow = business ? isBusinessOpen(business.businessHours) : false;
  const wa = business ? whatsappUrl(business) : '';
  const maps = business ? mapsUrl(business) : '';

  const nextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContactClick = () => {
    if (business) incrementBusinessClick(business.id);
  };

  const openWhatsApp = () => {
    if (!business || !wa) return;
    handleContactClick();
    const message = encodeURIComponent(`Hola, vi el perfil de ${business.name} en Villaguay Outbid y me interesa.`);
    const url = wa.includes('?') ? `${wa}&text=${message}` : `${wa}?text=${message}`;
    window.open(url, '_blank');
  };

  if (!isVisible || !business) return null;

  const cover = hasImages
    ? images[currentImageIndex]
    : getCategoryPlaceholder(business.category, business.name);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar ficha"
            className="absolute top-4 right-4 z-10 p-2 rounded-full glass-panel hover:bg-white/10 transition-colors"
          >
            <XIcon className="h-5 w-5 text-foreground" />
          </button>

          <div className="relative aspect-video sm:aspect-[16/9] bg-black/20">
            <img
              src={cover}
              alt={`${business.name} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getCategoryPlaceholder(business.category, business.name);
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentImageIndex ? 'bg-neon-green' : 'bg-white/30'
                      }`}
                      aria-label={`Foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{category?.emoji}</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {business.name}
                  </h2>
                </div>
                {business.slogan && (
                  <p className="text-sm text-muted-foreground italic mb-2">“{business.slogan}”</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {rank ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neon-gold/15 border border-neon-gold/40 text-neon-gold text-xs font-bold">
                      #{rank} en {category?.label}
                    </span>
                  ) : null}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      isOpenNow
                        ? 'bg-green-500/15 border border-green-500/40 text-green-500'
                        : 'bg-red-500/15 border border-red-500/40 text-red-500'
                    }`}
                  >
                    {isOpenNow ? (
                      <>
                        <span aria-hidden>🟢</span>
                        <Check className="h-3 w-3" />
                        Abierto
                      </>
                    ) : (
                      <>
                        <span aria-hidden>🔴</span>
                        <XIcon className="h-3 w-3" />
                        Cerrado
                      </>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">{category?.label}</span>
                </div>
              </div>
            </div>

            {business.description && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{business.description}</p>
              </div>
            )}

            {business.services && business.services.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-neon-green" />
                  Servicios y productos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((service, i) => (
                    <span
                      key={`${service}-${i}`}
                      className="px-3 py-1.5 rounded-full glass-panel text-xs text-muted-foreground border border-white/10"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-purple/15 border border-neon-purple/30 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-neon-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium mb-1">Dirección</p>
                  <p className="text-sm text-muted-foreground mb-2">{business.address}</p>
                  <a
                    href={maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleContactClick}
                    className="inline-flex items-center gap-1.5 text-xs text-neon-purple hover:text-neon-purple/80 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Abrir en Google Maps
                  </a>
                </div>
              </div>

              {business.businessHours && Object.values(business.businessHours).some(Boolean) && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-green/15 border border-neon-green/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-neon-green" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium mb-2">Horarios de atención</p>
                    <div className="space-y-1">
                      {DAY_LABELS.map(({ key, label }) =>
                        business.businessHours?.[key] ? (
                          <p key={key} className="text-xs text-muted-foreground">
                            {label}: {business.businessHours[key]}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {wa ? (
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </button>
              ) : null}
              {(business.socialLinks?.instagram || business.instagram) && (
                <button
                  type="button"
                  onClick={() => {
                    handleContactClick();
                    window.open(business.socialLinks?.instagram || business.instagram, '_blank');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel border border-white/10 text-foreground font-display font-bold text-sm hover:bg-white/10 transition-all"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </button>
              )}
            </div>

            {(onOutbid || onClaim || onPresupuesto) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {onPresupuesto && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onPresupuesto(business);
                    }}
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-neon-green/20 border border-neon-green/40 text-neon-green font-display font-bold text-sm"
                  >
                    Pedir Presupuesto
                  </button>
                )}
                {onOutbid && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onOutbid(business);
                    }}
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple font-display font-bold text-sm"
                  >
                    Superar puja
                  </button>
                )}
                {onClaim && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onClaim(business);
                    }}
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl glass-panel text-xs font-body text-muted-foreground hover:text-foreground"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Reclamar comercio
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Puja actual</p>
                  <p className="font-display text-xl font-bold text-neon-gold">{formatARS(business.bid)}</p>
                </div>
                <a
                  href={MERCADO_PAGO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-xs font-bold hover:bg-neon-purple/25 transition-all"
                >
                  Pagar puja
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BusinessDetailModal;
