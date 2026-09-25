'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Store, Tag } from 'lucide-react';
import { type CategoryId, categories, MIN_BID, formatARS } from '@/lib/mockData';
import { getStoredState, saveState, type AppState } from '@/lib/store';

interface LastPositionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryId;
  subcategory: string | null;
  discountedPrice: number;
}

export function LastPositionModal({
  open,
  onOpenChange,
  category,
  subcategory,
  discountedPrice,
}: LastPositionModalProps) {
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    instagram: '',
    slogan: '',
    imageUrl: '',
  });

  const handleSubmit = () => {
    if (!form.name) return;

    const state = getStoredState();
    const newBusiness = {
      id: 'last-pos-' + Date.now(),
      name: form.name,
      category,
      subcategory: subcategory || '',
      bid: discountedPrice,
      owner: 'Vos',
      address: 'Villaguay, Entre Ríos',
      image: form.imageUrl || 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      whatsapp: form.whatsapp.startsWith('http') ? form.whatsapp : `https://wa.me/${form.whatsapp.replace(/\D/g, '')}`,
      instagram: form.instagram.startsWith('http') ? form.instagram : `https://instagram.com/${form.instagram.replace('@', '')}`,
      slogan: form.slogan || 'Nuevo comercio en el ranking',
      daysAtTop: 0,
      clickCount: 0,
    };

    const catLabel = categories.find((c) => c.id === category)?.label || '';
    const subLabel = categories.find((c) => c.id === category)?.subcategories.find((s) => s.id === subcategory)?.label || '';

    const newEvent = {
      id: 'last-pos-event-' + Date.now(),
      message: `🆕 ${form.name} se sumó al último puesto de ${catLabel}${subLabel ? ` · ${subLabel}` : ''} con ${formatARS(discountedPrice)}`,
      timeAgo: 'hace instantes',
      category,
    };

    const nextState: AppState = {
      ...state,
      businesses: [...state.businesses, newBusiness],
      events: [newEvent, ...state.events],
    };

    saveState(nextState);
    onOpenChange(false);
    window.location.reload();
  };

  if (!open) return null;

  const currentCat = categories.find((c) => c.id === category);

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
            <div className="w-10 h-10 rounded-xl bg-neon-gold/20 border border-neon-gold/50 flex items-center justify-center">
              <Tag className="h-5 w-5 text-neon-gold" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Sumarse al Último Puesto</h3>
              <p className="text-xs text-muted-foreground font-body">Precio especial: {formatARS(discountedPrice)}</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Nombre del Comercio *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Mi Tienda"
              className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Categoría</label>
            <div className="px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground">
              {currentCat?.emoji} {currentCat?.label}
            </div>
          </div>

          {currentCat && currentCat.subcategories.length > 0 && (
            <div>
              <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Subcategoría</label>
              <div className="px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground">
                {subcategory ? currentCat.subcategories.find((s) => s.id === subcategory)?.label : 'Todas'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="Número"
                className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Instagram</label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="@usuario"
                className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Logo / Foto (URL)</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Slogan</label>
            <input
              type="text"
              value={form.slogan}
              onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              placeholder="Descripción corta"
              className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-gold/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.name}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all disabled:opacity-40"
        >
          <Store className="h-4 w-4" />
          Publicar por {formatARS(discountedPrice)}
        </button>

        <p className="text-[10px] text-muted-foreground/50 font-body text-center">
          Tu comercio ingresará al último puesto del ranking con el precio especial
        </p>
      </motion.div>
    </div>
  );
}
