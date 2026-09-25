'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Crown,
  Plus,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Trophy,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Upload,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  type Business,
  type CategoryId,
  type LiveEvent,
  categories,
  formatARS,
  MIN_BID,
  MIN_INCREMENT,
  MERCADO_PAGO_LINK,
  SUPPORT_WHATSAPP,
} from '@/lib/mockData';
import { processImage, getCategoryPlaceholder } from '@/lib/imageUtils';
import { audioManager } from '@/lib/audioManager';

export interface BidSubmission {
  business: Business;
  newEvents: LiveEvent[];
}

interface OutbidModalProps {
  business: Business | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryId;
  subcategory: string | null;
  currentPosition: number;
  rankedCount: number;
  onConfirm: (submission: BidSubmission) => void;
}

type Step = 'form' | 'payment' | 'confirm' | 'success';

export function OutbidModal({
  business,
  open,
  onOpenChange,
  category,
  subcategory,
  currentPosition,
  rankedCount,
  onConfirm,
}: OutbidModalProps) {
  const [step, setStep] = useState<Step>('form');

  const [formData, setFormData] = useState({
    name: '',
    category: category,
    subcategory: subcategory || '',
    bid: '',
    whatsapp: '',
    instagram: '',
    imageUrl: '',
    slogan: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const currentCat = categories.find((c) => c.id === category);
  const currentSub = currentCat?.subcategories.find((s) => s.id === subcategory);

  const isEmpty = rankedCount === 0;
  const targetBid = business ? business.bid : 0;
  const minBid = isEmpty ? MIN_BID : targetBid + MIN_INCREMENT;
  const bidValue = formData.bid ? parseInt(formData.bid) : minBid;
  const wouldBePosition = (() => {
    if (isEmpty) return 1;
    if (bidValue > targetBid) return currentPosition;
    return currentPosition + 1;
  })();

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        category,
        subcategory: subcategory || '',
        bid: String(minBid),
      }));
    }
  }, [open, category, subcategory, minBid]);

  const handleQuickAdd = (amount: number) => {
    const current = formData.bid ? parseInt(formData.bid) : minBid;
    setFormData({ ...formData, bid: String(current + amount) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const base64 = await processImage(file);
      setFormData({ ...formData, imageUrl: base64 });
      setImagePreview(base64);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al procesar la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playClick(); // Play click sound on form submit
    setStep('payment');
  };

  const handleConfirmPaid = () => {
    audioManager.playClick(); // Play click sound
    setStep('confirm');
  };

  const handleFinalConfirm = () => {
    audioManager.playOutbid(); // Play victory sound when confirming bid
    setStep('success');

    const newBusiness: Business = {
      id: 'user-' + Date.now(),
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      bid: bidValue,
      owner: 'Vos',
      address: 'Villaguay, Entre Ríos',
      image: formData.imageUrl || '',
      whatsapp: formData.whatsapp.startsWith('http')
        ? formData.whatsapp
        : `https://wa.me/${formData.whatsapp.replace(/\D/g, '')}`,
      instagram: formData.instagram.startsWith('http')
        ? formData.instagram
        : `https://instagram.com/${formData.instagram.replace('@', '')}`,
      slogan: formData.slogan || 'Nuevo comercio en el ranking',
      daysAtTop: 0,
      clickCount: 0,
    };

    const catLabel = currentCat?.label || '';
    const subLabel = currentSub ? ` · ${currentSub.label}` : '';
    const positionLabel = wouldBePosition === 1 ? 'el #1' : `el puesto #${wouldBePosition}`;
    const newEvent: LiveEvent = {
      id: 'user-event-' + Date.now(),
      message:
        wouldBePosition === 1
          ? `👑 ${formData.name} tomó el #1 en ${catLabel}${subLabel} con ${formatARS(bidValue)}`
          : `🔥 ${formData.name} escaló al ${positionLabel} en ${catLabel}${subLabel} con ${formatARS(bidValue)}`,
      timeAgo: 'hace instantes',
      category: formData.category,
    };

    onConfirm({ business: newBusiness, newEvents: [newEvent] });
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setStep('form');
        setFormData({
          name: '',
          category: category,
          subcategory: subcategory || '',
          bid: '',
          whatsapp: '',
          instagram: '',
          imageUrl: '',
          slogan: '',
        });
      }, 300);
    }
  };

  const steps: Step[] = ['form', 'payment', 'confirm', 'success'];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-panel/95 backdrop-blur-xl border border-white/10 max-h-[92vh] overflow-y-auto scrollbar-hide rounded-t-2xl sm:rounded-2xl p-0 sm:p-6 pt-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 px-6 pt-4 sm:pt-0 pb-2">
          {steps.map((s, i) => {
            const stepIndex = steps.indexOf(step);
            const isActive = i === stepIndex;
            const isPast = i < stepIndex;
            return (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-10 bg-neon-green' : isPast ? 'w-5 bg-neon-green/40' : 'w-5 bg-white/10'
                }`}
              />
            );
          })}
        </div>

        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: FORM */}
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold">
                    <Swords className="h-5 w-5 text-neon-purple" />
                    <span className="neon-text-purple">
                      {isEmpty ? 'Ocupar el #1' : `Destronar a ${business?.name}`}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-body">
                    {isEmpty
                      ? `Sé el primero en pujar por el #1 en ${currentCat?.label}${currentSub ? ` · ${currentSub.label}` : ''}`
                      : `Pujá por el puesto #${currentPosition} en ${currentCat?.label}${currentSub ? ` · ${currentSub.label}` : ''}`}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-3">
                  {/* Target info */}
                  <div className="glass-panel rounded-lg p-3 space-y-2">
                    {isEmpty ? (
                      <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                        <Crown className="h-3.5 w-3.5 text-neon-gold" />
                        Lista vacía — Monto mínimo para iniciar: <span className="text-neon-gold font-bold">{formatARS(MIN_BID)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                          <Crown className="h-3.5 w-3.5 text-neon-gold" />
                          Líder actual: <span className="text-foreground font-medium">{business?.name}</span>
                        </div>
                        <div className="flex justify-between text-xs font-body">
                          <span className="text-muted-foreground">Puja actual</span>
                          <span className="text-neon-green font-semibold">{formatARS(targetBid)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-body">
                          <span className="text-muted-foreground">Mínimo para superar</span>
                          <span className="text-neon-gold font-bold">{formatARS(minBid)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Business name */}
                  <div>
                    <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Nombre del Comercio</label>
                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Mi Negocio" className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors" />
                  </div>

                  {/* Category (preselected) */}
                  <div>
                    <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Categoría</label>
                    <div className="px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-neon-green flex items-center gap-2">
                      <span>{currentCat?.emoji}</span>
                      <span>{currentCat?.label}</span>
                      {currentSub && <span className="text-muted-foreground">· {currentSub.label}</span>}
                      <span className="ml-auto text-[10px] text-muted-foreground/50">preseleccionado</span>
                    </div>
                  </div>

                  {/* Bid amount */}
                  <div>
                    <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Tu Puja (ARS)</label>
                    <input required type="number" min={minBid} value={formData.bid} onChange={(e) => setFormData({ ...formData, bid: e.target.value })} className="w-full px-3 py-3 rounded-lg glass-panel text-lg font-display font-bold text-foreground text-center focus:outline-none focus:border-neon-purple/50 transition-colors" />
                    <div className="flex gap-2 mt-2">
                      {[500, 1000, 2000].map((amt) => (
                        <button key={amt} type="button" onClick={() => handleQuickAdd(amt)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg glass-panel-hover text-xs font-body font-medium text-neon-green hover:text-neon-green transition-all">
                          <Plus className="h-3 w-3" />${amt.toLocaleString('es-AR')}
                        </button>
                      ))}
                    </div>
                    {bidValue < minBid && (
                      <p className="text-[10px] text-destructive font-body mt-1.5 text-center">La puja mínima es {formatARS(minBid)}</p>
                    )}
                  </div>

                  {/* WhatsApp + Instagram */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">WhatsApp</label>
                      <input required value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="+54 345..." className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Instagram</label>
                      <input required value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@usuario" className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors" />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Logo / Imagen</label>
                    <div className="space-y-2">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-white/10"
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
                        <div className="glass-panel rounded-lg p-4 border-2 border-dashed border-white/10 hover:border-neon-purple/30 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                          >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-body">
                              {uploadingImage ? 'Procesando...' : 'Click para subir imagen'}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 font-body">
                              Máximo 2MB
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slogan */}
                  <div>
                    <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Slogan / Frase</label>
                    <input value={formData.slogan} onChange={(e) => setFormData({ ...formData, slogan: e.target.value })} placeholder="Ej: El mejor de Villaguay" className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors" />
                  </div>

                  <button type="submit" disabled={bidValue < minBid || !formData.name} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-purple text-white font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Ir a Pagar <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold">
                    <CreditCard className="h-5 w-5 text-neon-green" />
                    <span className="neon-text-green">Pago de la Puja</span>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-body">Procesá el pago para confirmar tu puesto</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-3">
                  {/* Order summary */}
                  <div className="glass-panel rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">
                      <Trophy className="h-3.5 w-3.5 text-neon-gold" /> Resumen del Pedido
                    </div>
                    <div className="flex justify-between text-sm font-body"><span className="text-muted-foreground">Comercio</span><span className="text-foreground font-medium">{formData.name}</span></div>
                    <div className="flex justify-between text-sm font-body"><span className="text-muted-foreground">Categoría</span><span className="text-foreground">{currentCat?.emoji} {currentCat?.label}</span></div>
                    {currentSub && <div className="flex justify-between text-sm font-body"><span className="text-muted-foreground">Sub-rubro</span><span className="text-foreground">{currentSub.label}</span></div>}
                    <div className="flex justify-between text-sm font-body"><span className="text-muted-foreground">Puesto objetivo</span><span className="text-neon-gold font-bold">#{wouldBePosition} · hasta fin de mes</span></div>
                    <div className="flex justify-between text-sm font-body pt-2 border-t border-white/5"><span className="text-muted-foreground">Monto a pagar</span><span className="text-neon-green font-display font-bold text-lg">{formatARS(bidValue)}</span></div>
                  </div>

                  {/* Mercado Pago payment button */}
                  <div className="space-y-3">
                    <div className="text-xs font-body text-muted-foreground text-center">Pagá con Mercado Pago y volvé para confirmar:</div>
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

                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[10px] text-muted-foreground/50 font-body uppercase">o</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Transfer info */}
                    <div className="glass-panel rounded-xl p-4 space-y-2">
                      <div className="text-sm font-display font-bold text-foreground">Transferencia directa</div>
                      <div className="flex justify-between text-xs font-body"><span className="text-muted-foreground">Alias</span><span className="text-foreground font-mono font-medium select-all">VILLAGUAY.OUTBID.MP</span></div>
                      <div className="flex justify-between text-xs font-body"><span className="text-muted-foreground">Titular</span><span className="text-foreground">Villaguay Outbid SRL</span></div>
                      <div className="flex justify-between text-xs font-body"><span className="text-muted-foreground">CBU</span><span className="text-foreground font-mono select-all">0000003100000000000001</span></div>
                    </div>
                  </div>

                  {/* Already paid button */}
                  <button
                    onClick={handleConfirmPaid}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Ya realicé el pago
                  </button>

                  <button onClick={() => setStep('form')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Volver al formulario
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONFIRM via WhatsApp */}
            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold">
                    <MessageCircle className="h-5 w-5 text-neon-green" />
                    <span className="neon-text-green">Validá tu Puesto</span>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-body">Enviá tu comprobante por WhatsApp para confirmar al instante</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-3">
                  <div className="glass-panel rounded-xl p-4 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-neon-green/15 border border-neon-green/40 flex items-center justify-center mx-auto">
                      <MessageCircle className="h-7 w-7 text-neon-green" />
                    </div>
                    <p className="text-sm font-body text-foreground">
                      Una vez realizada la transferencia, enviá tu comprobante por WhatsApp para validar tu puesto al instante.
                    </p>
                    <div className="glass-panel rounded-lg p-2.5 text-xs font-body text-muted-foreground space-y-1">
                      <div className="flex justify-between"><span>Comercio:</span><span className="text-foreground">{formData.name}</span></div>
                      <div className="flex justify-between"><span>Monto:</span><span className="text-neon-green font-semibold">{formatARS(bidValue)}</span></div>
                      <div className="flex justify-between"><span>Puesto:</span><span className="text-neon-gold font-bold">#{wouldBePosition}</span></div>
                    </div>
                  </div>

                  <a
                    href={SUPPORT_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleFinalConfirm}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Enviar Comprobante por WhatsApp
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>

                  <button onClick={handleFinalConfirm} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg glass-panel-hover text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    Ya envié el comprobante
                  </button>

                  <button onClick={() => setStep('payment')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Volver al pago
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-20 h-20 rounded-full bg-neon-gold/15 border border-neon-gold/50 flex items-center justify-center mb-6">
                  <Trophy className="h-10 w-10 text-neon-gold" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold shimmer-gold mb-2">¡Puja Confirmada!</h2>
                <p className="text-sm text-muted-foreground font-body max-w-sm">
                  Tu comercio <span className="text-foreground font-semibold">{formData.name}</span> pujó {formatARS(bidValue)} y ocupa el puesto #{wouldBePosition} en {currentCat?.label}{currentSub ? ` · ${currentSub.label}` : ''}.
                </p>
                {wouldBePosition === 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 px-4 py-2 rounded-full bg-neon-gold/15 border border-neon-gold/40">
                    <span className="text-sm font-display font-bold text-neon-gold">¡Sos el nuevo LÍDER de Villaguay!</span>
                  </motion.div>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <Calendar className="h-3.5 w-3.5" />
                  Válido hasta el último día de este mes
                </div>
                <button onClick={() => handleClose(false)} className="mt-6 px-6 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all">
                  Ver el Ranking
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
