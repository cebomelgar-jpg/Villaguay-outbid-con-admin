'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wrench, Search, ArrowLeft, Plus, Award, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { OficioCard } from '@/components/OficioCard';
import { PublicarOficioModal } from '@/components/PublicarOficioModal';
import { PresupuestoExpressModal } from '@/components/PresupuestoExpressModal';
import { ReglamentoModal } from '@/components/ReglamentoModal';
import { OFICIO_TRADES, type Oficio } from '@/lib/oficiosData';
import { getStoredState, submitPendingOficio, subscribeToState, type AppState } from '@/lib/store';
import { categories } from '@/lib/mockData';

export default function OficiosPage() {
  const router = useRouter();
  const [reglamentoOpen, setReglamentoOpen] = useState(false);
  const [publicarOpen, setPublicarOpen] = useState(false);
  const [presupuestoOpen, setPresupuestoOpen] = useState(false);
  const [presupuestoTarget, setPresupuestoTarget] = useState<Oficio | null>(null);
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState<string>('');
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(getStoredState());
    const unsub = subscribeToState(() => setState(getStoredState()));
    return unsub;
  }, []);

  const oficios = state?.oficios ?? [];

  const filteredOficios = useMemo(() => {
    return oficios
      .filter((o) => {
        if (tradeFilter && o.trade !== tradeFilter) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          o.name.toLowerCase().includes(q) ||
          o.trade.toLowerCase().includes(q) ||
          o.zone.toLowerCase().includes(q) ||
          o.bio.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.rating - a.rating);
  }, [oficios, search, tradeFilter]);

  const handlePresupuesto = (oficio: Oficio) => {
    setPresupuestoTarget(oficio);
    setPresupuestoOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header
        onOpenReglamento={() => setReglamentoOpen(true)}
        onOpenPublicar={() => {
          router.push('/');
          setTimeout(() => {
            const event = new CustomEvent('open-publicar');
            window.dispatchEvent(event);
          }, 100);
        }}
      />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back link */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-body mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al leaderboard
        </button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30 mb-3">
            <Wrench className="h-4 w-4 text-neon-green" />
            <span className="text-xs font-display font-bold text-neon-green tracking-wide">OFICIOS & CHANGAS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-foreground">Trabajadores de </span>
            <span className="neon-text-green">Villaguay</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-body mt-3 max-w-2xl mx-auto text-balance">
            Encontrá electricistas, plomeros, pintores, cuidadores y más. Todos los trabajadores independientes de la ciudad en un solo lugar.
          </p>
        </motion.div>

        {/* CTA Publicar */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => setPublicarOpen(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all"
        >
          <Plus className="h-4 w-4" />
          Publicar mi Oficio
        </motion.button>

        {/* Buscador + Filtros */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, oficio, zona o descripción..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTradeFilter('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                tradeFilter === ''
                  ? 'bg-neon-green/15 border border-neon-green/50 text-neon-green'
                  : 'glass-panel text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos
            </button>
            {OFICIO_TRADES.filter((t) => oficios.some((o) => o.trade === t)).map((trade) => (
              <button
                key={trade}
                onClick={() => setTradeFilter(trade)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                  tradeFilter === trade
                    ? 'bg-neon-green/15 border border-neon-green/50 text-neon-green'
                    : 'glass-panel text-muted-foreground hover:text-foreground'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="glass-panel rounded-xl p-3 sm:p-4 mb-6 flex items-center gap-3 border border-neon-purple/20">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-purple/15 flex items-center justify-center">
            <Award className="h-5 w-5 text-neon-purple" />
          </div>
          <p className="text-xs sm:text-sm font-body text-muted-foreground leading-relaxed">
            <span className="text-neon-purple font-semibold">Medallas:</span>{' '}
            Los trabajadores reciben medallas según las reseñas de los vecinos. Oro, Plata y Bronce para los más valorados; Recomendado y Nuevo para los que recién arrancan.
          </p>
        </div>

        {/* Listado */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
            Directorio de Oficios
          </h3>
          <span className="text-xs text-muted-foreground font-body">
            {filteredOficios.length} {filteredOficios.length === 1 ? 'trabajador' : 'trabajadores'}
          </span>
        </div>

        {filteredOficios.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center space-y-4 border border-neon-gold/20">
            <div className="w-16 h-16 rounded-full bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center mx-auto">
              <Wrench className="h-8 w-8 text-neon-gold" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-foreground mb-2">No hay resultados</h4>
              <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
                No encontramos trabajadores que coincidan con tu búsqueda. Probá con otro término o publicá tu oficio.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredOficios.map((oficio, index) => (
                <OficioCard
                  key={oficio.id}
                  oficio={oficio}
                  position={index + 1}
                  onPresupuesto={handlePresupuesto}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-muted-foreground/50 font-body">
            VILLAGUAY OUTBID — Directorio de Oficios & Changas de Villaguay, Entre Ríos.
          </p>
          <p className="text-xs text-muted-foreground/40 font-body mt-1">
            Las medallas se otorgan según reseñas verificadas de los vecinos.
          </p>
        </footer>
      </main>

      {/* Modals */}
      <ReglamentoModal open={reglamentoOpen} onOpenChange={setReglamentoOpen} />
      <PublicarOficioModal open={publicarOpen} onOpenChange={setPublicarOpen} />
      <PresupuestoExpressModal
        open={presupuestoOpen}
        onOpenChange={setPresupuestoOpen}
        preselectedCategory={null}
        preselectedBusiness={null}
        businesses={[]}
      />
    </div>
  );
}
