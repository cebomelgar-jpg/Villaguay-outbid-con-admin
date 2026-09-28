'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Loader2, Copy, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PublicistaRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublicistaRegisterModal({ open, onOpenChange }: PublicistaRegisterModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    nombre_publico: '',
    whatsapp_contacto: '',
  });
  const [createdPublicista, setCreatedPublicista] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/publicistas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar publicista');
      }

      const data = await response.json();
      setCreatedPublicista(data.publicista);
      setStep('success');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar publicista');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setStep('form');
        setFormData({ nombre_usuario: '', nombre_publico: '', whatsapp_contacto: '' });
        setCreatedPublicista(null);
      }, 300);
    }
  };

  const copyReferralLink = () => {
    if (!createdPublicista) return;
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://villaguayoutbid.netlify.app';
    const referralLink = `${baseUrl}/?ref=${createdPublicista.ref_key}`;
    
    navigator.clipboard.writeText(referralLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const shareOnWhatsApp = () => {
    if (!createdPublicista) return;
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://villaguayoutbid.netlify.app';
    const referralLink = `${baseUrl}/?ref=${createdPublicista.ref_key}`;
    const message = `¡Sumate a Villaguay Outbid! Accedé al ranking más competitivo de comercios: ${referralLink}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-panel/95 backdrop-blur-xl border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-2xl font-bold">
                <Trophy className="h-6 w-6 text-neon-gold" />
                <span className="neon-text-gold">Crear Cuenta de Publicista</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-body">
                Generá tu enlace único y empezá a ganar puntos por cada visita que traigas a la plataforma
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nombre de Usuario (para tu enlace)
                </label>
                <input
                  required
                  value={formData.nombre_usuario}
                  onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                  placeholder="Ej: juanperez"
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
                />
                <p className="text-[10px] text-muted-foreground/60 font-body mt-1">
                  Este nombre formará parte de tu enlace: villaguayoutbid.netlify.app/?ref=juanperez
                </p>
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nombre Público (para el ranking)
                </label>
                <input
                  required
                  value={formData.nombre_publico}
                  onChange={(e) => setFormData({ ...formData, nombre_publico: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  WhatsApp de Contacto
                </label>
                <input
                  required
                  value={formData.whatsapp_contacto}
                  onChange={(e) => setFormData({ ...formData, whatsapp_contacto: e.target.value })}
                  placeholder="+54 345 ..."
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear mi Link de Publicista'
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-neon-gold/15 border border-neon-gold/50 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-neon-gold" />
            </motion.div>
            
            <h2 className="font-display text-2xl font-bold neon-text-gold mb-2">
              ¡Cuenta Creada!
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-sm mb-6">
              Tu enlace único está listo. Compartilo y empezá a ganar puntos por cada visita.
            </p>

            {createdPublicista && (
              <div className="w-full space-y-3">
                <div className="glass-panel rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-1">
                    Tu enlace único
                  </p>
                  <p className="text-xs font-mono text-neon-gold break-all">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://villaguayoutbid.netlify.app'}/?ref={createdPublicista.ref_key}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={copyReferralLink}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg glass-panel-hover font-body text-sm font-medium text-foreground hover:text-neon-gold transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neon-green/15 border border-neon-green/40 text-neon-green font-body text-sm font-medium hover:bg-neon-green/25 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => handleClose(false)}
              className="mt-6 px-6 py-2.5 rounded-xl glass-panel-hover font-body text-sm font-medium text-foreground hover:text-neon-gold transition-colors"
            >
              Ver mi Ranking
            </button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}