'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { categories, type CategoryId, MIN_BID } from '@/lib/mockData';

interface PublicarComercioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (data: { category: CategoryId; subcategory: string; name: string; bid: number; whatsapp: string; instagram: string; slogan: string; imageUrl: string }) => void;
}

export function PublicarComercioModal({ open, onOpenChange, onPublish }: PublicarComercioModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as CategoryId | '',
    subcategory: '',
    bid: '',
    whatsapp: '',
    instagram: '',
    slogan: '',
    imageUrl: '',
  });

  const currentCat = categories.find((c) => c.id === formData.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      if (formData.category && formData.subcategory) {
        onPublish({
          category: formData.category,
          subcategory: formData.subcategory,
          name: formData.name,
          bid: parseInt(formData.bid) || MIN_BID,
          whatsapp: formData.whatsapp,
          instagram: formData.instagram,
          slogan: formData.slogan,
          imageUrl: formData.imageUrl,
        });
      }
    }, 1500);
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setStep('form');
        setFormData({ name: '', category: '', subcategory: '', bid: '', whatsapp: '', instagram: '', slogan: '', imageUrl: '' });
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
                <Store className="h-6 w-6 text-neon-green" />
                <span className="neon-text-green">Publicar mi Comercio</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-body">
                Sumá tu negocio al leaderboard y empezá a competir por el #1
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Nombre del Comercio</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Mi Negocio" className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Categoría</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => setFormData({ ...formData, category: cat.id, subcategory: '' })} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-body font-medium transition-all ${formData.category === cat.id ? 'bg-neon-green/15 border border-neon-green/50 text-neon-green' : 'glass-panel text-muted-foreground hover:text-foreground'}`}>
                      <span>{cat.emoji}</span><span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentCat && currentCat.subcategories.length > 0 && (
                <div>
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Subcategoría</label>
                  <div className="flex flex-wrap gap-2">
                    {currentCat.subcategories.map((sub) => (
                      <button key={sub.id} type="button" onClick={() => setFormData({ ...formData, subcategory: sub.id })} className={`px-3 py-2 rounded-lg text-xs font-body font-medium transition-all ${formData.subcategory === sub.id ? 'bg-neon-purple/15 border border-neon-purple/40 text-neon-purple' : 'glass-panel text-muted-foreground hover:text-foreground'}`}>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Puja Inicial (ARS) — Mínimo ${MIN_BID}</label>
                <input required type="number" min={MIN_BID} value={formData.bid} onChange={(e) => setFormData({ ...formData, bid: e.target.value })} placeholder={String(MIN_BID)} className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">WhatsApp</label>
                  <input required value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="+54 345 ..." className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Instagram</label>
                  <input required value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@tu_comercio" className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Logo / Imagen (URL)</label>
                <input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
              </div>

              <div>
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Slogan / Frase</label>
                <input value={formData.slogan} onChange={(e) => setFormData({ ...formData, slogan: e.target.value })} placeholder="Ej: El mejor de Villaguay" className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors" />
              </div>

              <button type="submit" disabled={loading || !formData.category || !formData.subcategory} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all disabled:opacity-60">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Publicando...</> : 'Publicar y Competir'}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-20 h-20 rounded-full bg-neon-green/15 border border-neon-green/50 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-neon-green" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold neon-text-green mb-2">¡Comercio Publicado!</h2>
            <p className="text-sm text-muted-foreground font-body max-w-sm">Tu comercio ya forma parte del leaderboard. Comenzá a pujar para escalar posiciones y conquistar el #1 de tu categoría.</p>
            <button onClick={() => handleClose(false)} className="mt-6 px-6 py-2.5 rounded-xl glass-panel-hover font-body text-sm font-medium text-foreground hover:text-neon-green transition-colors">Volver al Leaderboard</button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
