'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OFICIO_TRADES, VILLAGUAY_ZONES, SUPPORT_WHATSAPP_OFICIOS } from '@/lib/oficiosData';
import { submitPendingOficio } from '@/lib/store';

interface PublicarOficioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublicarOficioModal({ open, onOpenChange }: PublicarOficioModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trade: '',
    zone: '',
    whatsapp: '',
    bio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    submitPendingOficio({
      name: formData.name,
      trade: formData.trade,
      zone: formData.zone,
      whatsapp: formData.whatsapp.startsWith('http') ? formData.whatsapp : `https://wa.me/${formData.whatsapp.replace(/\D/g, '')}`,
      bio: formData.bio,
    });
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1200);
  };

  const buildAdminWhatsAppUrl = (): string => {
    const text = `*NUEVA SOLICITUD DE OFICIO* 🛠️
*Villaguay Outbid — Oficios & Changas*

*Nombre/Apodo:* ${formData.name}
*Oficio:* ${formData.trade}
*Zona:* ${formData.zone}
*WhatsApp:* ${formData.whatsapp}
*Descripción:* ${formData.bio}

_Enviado desde Villaguay Outbid_`;

    return `${SUPPORT_WHATSAPP_OFICIOS}&text=${encodeURIComponent(text)}`;
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setStep('form');
        setFormData({ name: '', trade: '', zone: '', whatsapp: '', bio: '' });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-panel/95 backdrop-blur-xl border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-2xl font-bold">
                <Wrench className="h-6 w-6 text-neon-green" />
                <span className="neon-text-green">Publicar mi Oficio</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-body">
                Sumate al directorio de trabajadores de Villaguay. El administrador revisa tu solicitud y te agrega al listado.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nombre o Apodo
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Carlitos Giménez"
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Oficio principal
                </label>
                <select
                  required
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50 transition-colors"
                >
                  <option value="">Seleccioná tu oficio</option>
                  {OFICIO_TRADES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Zona / Barrio de atención
                </label>
                <select
                  required
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50 transition-colors"
                >
                  <option value="">Seleccioná tu zona</option>
                  {VILLAGUAY_ZONES.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  WhatsApp de contacto
                </label>
                <input
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+54 345 ..."
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Contá brevemente qué hacés <span className="text-muted-foreground/50">(opcional)</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Ej: Electricista matriculado, 15 años de experiencia, urgencias 24hs."
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  'Enviar solicitud al administrador'
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
              className="w-20 h-20 rounded-full bg-neon-green/15 border border-neon-green/50 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-neon-green" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold neon-text-green mb-2">¡Solicitud Enviada!</h2>
            <p className="text-sm text-muted-foreground font-body max-w-sm mb-6">
              Se va a abrir WhatsApp con los datos para que el administrador los reciba. Una vez aprobado, vas a aparecer en el directorio de Oficios.
            </p>
            <a
              href={buildAdminWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </a>
            <button
              onClick={() => handleClose(false)}
              className="mt-3 px-6 py-2.5 rounded-xl glass-panel-hover font-body text-sm font-medium text-foreground hover:text-neon-green transition-colors"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
