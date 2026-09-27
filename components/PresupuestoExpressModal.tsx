'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, Flame, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { categories, type CategoryId, type Business } from '@/lib/mockData';

type Urgency = 'baja' | 'media' | 'alta';

const URGENCY_CONFIG: Record<Urgency, { label: string; icon: typeof Clock; color: string; border: string; bg: string }> = {
  baja: { label: 'Baja', icon: Clock, color: 'text-neon-blue', border: 'border-neon-blue/40', bg: 'bg-neon-blue/15' },
  media: { label: 'Media', icon: Flame, color: 'text-neon-gold', border: 'border-neon-gold/40', bg: 'bg-neon-gold/15' },
  alta: { label: 'Urgente', icon: AlertTriangle, color: 'text-neon-red', border: 'border-neon-red/40', bg: 'bg-neon-red/15' },
};

interface PresupuestoExpressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCategory?: CategoryId | null;
  preselectedBusiness?: Business | null;
  businesses: Business[];
}

export function PresupuestoExpressModal({
  open,
  onOpenChange,
  preselectedCategory,
  preselectedBusiness,
  businesses,
}: PresupuestoExpressModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: (preselectedCategory ?? '') as CategoryId | '',
    businessId: preselectedBusiness?.id ?? '',
    urgency: 'media' as Urgency,
    description: '',
    phone: '',
  });

  const availableBusinesses = useMemo(() => {
    if (!formData.category) return [];
    return businesses.filter((b) => b.category === formData.category && b.status === 'active');
  }, [formData.category, businesses]);

  const selectedBusiness = useMemo(
    () => availableBusinesses.find((b) => b.id === formData.businessId) ?? null,
    [availableBusinesses, formData.businessId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1200);
  };

  const buildWhatsAppUrl = (): string => {
    const urgencyLabel = URGENCY_CONFIG[formData.urgency].label;
    const bizName = selectedBusiness?.name ?? 'Comercio de Villaguay';
    const catLabel = categories.find((c) => c.id === formData.category)?.label ?? '';
    const phoneLine = formData.phone ? `\n*Teléfono de contacto:* ${formData.phone}` : '';

    const text = `*PEDIDO DE PRESUPUESTO EXPRESS* 📩
*Villaguay Outbid*

*Rubro:* ${catLabel}
${selectedBusiness ? `*Comercio:* ${bizName}` : ''}
*Urgencia:* ${urgencyLabel}

*Trabajo solicitado:*
${formData.description}${phoneLine}

_Enviado desde Villaguay Outbid_`;

    const waRaw = selectedBusiness?.whatsapp || selectedBusiness?.socialLinks?.whatsapp || '';
    const waUrl = waRaw.includes('wa.me')
      ? waRaw
      : waRaw.startsWith('http')
        ? waRaw
        : `https://wa.me/${waRaw.replace(/\D/g, '')}`;

    return `${waUrl}${waUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setStep('form');
        setFormData({
          category: (preselectedCategory ?? '') as CategoryId | '',
          businessId: preselectedBusiness?.id ?? '',
          urgency: 'media',
          description: '',
          phone: '',
        });
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
                <Send className="h-6 w-6 text-neon-green" />
                <span className="neon-text-green">Presupuesto Express</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-body">
                Pedí un presupuesto rápido. El comercio lo recibe directo por WhatsApp.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              {/* Rubro */}
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Rubro / Categoría
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id, businessId: '' })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-body font-medium transition-all ${
                        formData.category === cat.id
                          ? 'bg-neon-green/15 border border-neon-green/50 text-neon-green'
                          : 'glass-panel text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comercio destino */}
              {availableBusinesses.length > 0 && (
                <div>
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Comercio de destino <span className="text-muted-foreground/50">(opcional)</span>
                  </label>
                  <select
                    value={formData.businessId}
                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50 transition-colors"
                  >
                    <option value="">Cualquier comercio del rubro</option>
                    {availableBusinesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Urgencia */}
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nivel de urgencia
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(URGENCY_CONFIG) as Urgency[]).map((key) => {
                    const cfg = URGENCY_CONFIG[key];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency: key })}
                        className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-body font-bold transition-all ${
                          formData.urgency === key
                            ? `${cfg.bg} border ${cfg.border} ${cfg.color}`
                            : 'glass-panel text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descripción del trabajo */}
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Describí el trabajo o presupuesto que necesitás
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Ej: Necesito pintar dos habitaciones de 3x3m, con cielorraso. Tengo los materiales."
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors resize-none"
                />
              </div>

              {/* Teléfono opcional */}
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Tu teléfono <span className="text-muted-foreground/50">(opcional)</span>
                </label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+54 345 ..."
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
                />
              </div>

              {/* Botón final */}
              <button
                type="submit"
                disabled={loading || !formData.category || !formData.description.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Preparando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar Solicitud por WhatsApp
                  </>
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
            <h2 className="font-display text-2xl font-bold neon-text-green mb-2">¡Solicitud Lista!</h2>
            <p className="text-sm text-muted-foreground font-body max-w-sm mb-6">
              Se va a abrir WhatsApp con el mensaje ya armado. Solo tenés que tocar enviar para que el comercio lo reciba.
            </p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Abrir WhatsApp y Enviar
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
