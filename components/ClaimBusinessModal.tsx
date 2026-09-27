'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Building2, CheckCircle2, AlertCircle, Upload, CreditCard, ExternalLink } from 'lucide-react';
import { type Business, formatARS, MIN_INCREMENT, MERCADO_PAGO_LINK } from '@/lib/mockData';
import { getStoredState, saveState, type AppState } from '@/lib/store';
import { processImage } from '@/lib/imageUtils';

interface ClaimBusinessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: Business;
}

export function ClaimBusinessModal({ open, onOpenChange, business }: ClaimBusinessModalProps) {
  const [step, setStep] = useState<'verify' | 'bid' | 'payment' | 'success'>('verify');
  const [form, setForm] = useState({
    whatsapp: '',
    instagram: '',
    confirmOwnership: false,
    imageUrl: '',
  });
  const [bidAmount, setBidAmount] = useState(String(business.bid + MIN_INCREMENT));
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleVerify = () => {
    if (!form.whatsapp || !form.instagram || !form.confirmOwnership) return;
    setStep('bid');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const base64 = await processImage(file);
      setForm({ ...form, imageUrl: base64 });
      setImagePreview(base64);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al procesar la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, imageUrl: '' });
    setImagePreview('');
  };

  const handleBid = () => {
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    const state = getStoredState();
    const newBid = parseInt(bidAmount) || business.bid + MIN_INCREMENT;

    const updatedBusiness = {
      ...business,
      bid: newBid,
      whatsapp: form.whatsapp.startsWith('http') ? form.whatsapp : `https://wa.me/${form.whatsapp.replace(/\D/g, '')}`,
      instagram: form.instagram.startsWith('http') ? form.instagram : `https://instagram.com/${form.instagram.replace('@', '')}`,
      image: form.imageUrl || business.image,
      owner: 'Reclamado',
    };

    const newEvent = {
      id: 'claim-' + Date.now(),
      message: `🔐 ${business.name} fue reclamado por su dueño y aumentó su puja a ${formatARS(newBid)}`,
      timeAgo: 'hace instantes',
      category: business.category,
    };

    const nextState: AppState = {
      ...state,
      businesses: state.businesses.map((b) => (b.id === business.id ? updatedBusiness : b)),
      events: [newEvent, ...state.events],
    };

    saveState(nextState);
    setStep('success');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto scrollbar-hide space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-neon-purple" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Reclamar Comercio</h3>
              <p className="text-xs text-muted-foreground font-body">{business.name}</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-xl p-4 border border-neon-purple/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-neon-purple flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-body text-foreground">
                    Vas a reclamar este comercio. Necesitamos verificar que sos el dueño legítimo.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">WhatsApp de Contacto *</label>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="Número de WhatsApp"
                  className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Instagram *</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@usuario"
                  className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.confirmOwnership}
                  onChange={(e) => setForm({ ...form, confirmOwnership: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground font-body">
                  Confirmo que soy el dueño o representante legal de {business.name}
                </span>
              </label>

              <div>
                <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Actualizar Logo (Opcional)</label>
                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="glass-panel rounded-lg p-3 border-2 border-dashed border-white/10 hover:border-neon-purple/30 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                        id="claim-image-upload"
                      />
                      <label
                        htmlFor="claim-image-upload"
                        className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-body">
                          {uploadingImage ? 'Procesando...' : 'Subir nueva imagen'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={!form.whatsapp || !form.instagram || !form.confirmOwnership}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-purple text-white font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-40"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 'bid' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-xl p-4 border border-neon-green/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-body">Puja actual</span>
                <span className="text-lg font-display font-bold text-neon-green">{formatARS(business.bid)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Nueva puja mínima</span>
                <span className="text-lg font-display font-bold text-neon-gold">{formatARS(business.bid + MIN_INCREMENT)}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Monto de tu puja</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={business.bid + MIN_INCREMENT}
                className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-display font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
              />
            </div>

            <button
              onClick={handleBid}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20pxrgba(0,255,135,0.4)] transition-all"
            >
              Ir a Pagar
            </button>

            <button
              onClick={() => setStep('verify')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel text-muted-foreground hover:text-foreground font-body font-medium text-sm transition-colors"
            >
              Volver
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-xl p-4 border border-neon-green/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-body">Puja actual</span>
                <span className="text-lg font-display font-bold text-neon-green">{formatARS(business.bid)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Nueva puja</span>
                <span className="text-lg font-display font-bold text-neon-gold">{formatARS(parseInt(bidAmount) || business.bid + MIN_INCREMENT)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-body text-muted-foreground text-center">Pagá con Mercado Pago para confirmar tu reclamo:</div>
              <a
                href={MERCADO_PAGO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl bg-[#00B1EA] text-white font-display font-bold text-sm hover:bg-[#0099D0] hover:shadow-[0_0_25px_rgba(0,177,234,0.4)] transition-all"
              >
                <CreditCard className="h-5 w-5" />
                Pagar con Mercado Pago
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              Ya pagué, confirmar
            </button>

            <button
              onClick={() => setStep('bid')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel text-muted-foreground hover:text-foreground font-body font-medium text-sm transition-colors"
            >
              Volver
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-neon-green" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-foreground mb-2">¡Comercio Reclamado!</h4>
              <p className="text-sm text-muted-foreground font-body">
                {business.name} ahora está bajo tu control y tu puja ha sido actualizada.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
            >
              Finalizar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
