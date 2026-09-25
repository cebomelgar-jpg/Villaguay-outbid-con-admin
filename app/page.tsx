'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Crown, Swords, Trophy, Lock, Eye, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Ticker } from '@/components/Ticker';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { LeaderCard } from '@/components/LeaderCard';
import { CompactCard } from '@/components/CompactCard';
import { ReglamentoModal } from '@/components/ReglamentoModal';
import { PublicarComercioModal } from '@/components/PublicarComercioModal';
import { OutbidModal, type BidSubmission } from '@/components/OutbidModal';
import { Confetti } from '@/components/Confetti';
import { LastPositionCard } from '@/components/LastPositionCard';
import { LastPositionModal } from '@/components/LastPositionModal';
import { GlobalLeaders } from '@/components/GlobalLeaders';
import { ClaimBusinessModal } from '@/components/ClaimBusinessModal';
import { MonthCountdown } from '@/components/MonthCountdown';
import { useSound } from '@/hooks/use-sound';
import {
  categories,
  getBusinessesByCategory,
  formatARS,
  MIN_BID,
  type CategoryId,
  type Business,
  type LiveEvent,
} from '@/lib/mockData';
import {
  getStoredState,
  saveState,
  subscribeToState,
  incrementTotalVisits,
  type AppState,
  type PendingBid,
} from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('gastronomia');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [reglamentoOpen, setReglamentoOpen] = useState(false);
  const [publicarOpen, setPublicarOpen] = useState(false);
  const [outbidTarget, setOutbidTarget] = useState<Business | null>(null);
  const [outbidOpen, setOutbidOpen] = useState(false);
  const [lastPositionOpen, setLastPositionOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<Business | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const { play } = useSound();

  useEffect(() => {
    setIsMounted(true);
    setAppState(getStoredState());
    const unsub = subscribeToState(() => setAppState(getStoredState()));

    // Increment total visits on page load
    incrementTotalVisits();

    return unsub;
  }, []);

  const handleConfirmBid = useCallback(
    (submission: BidSubmission) => {
      const { business: newBusiness, newEvents } = submission;

      setAppState((prev) => {
        if (!prev) return prev;
        const existing = prev.businesses.find((b) => b.id === newBusiness.id);
        const businesses = existing
          ? prev.businesses.map((b) => (b.id === newBusiness.id ? { ...b, bid: newBusiness.bid } : b))
          : [...prev.businesses, newBusiness];

        const pendingBid: PendingBid = {
          id: 'pending-' + Date.now(),
          business: newBusiness,
          status: 'pending',
          createdAt: Date.now(),
        };

        const next: AppState = {
          ...prev,
          businesses,
          events: [...newEvents, ...prev.events],
          pendingBids: [...prev.pendingBids, pendingBid],
        };
        saveState(next);
        return next;
      });

      const isLeader = newBusiness.bid >= (appState?.businesses.find(b => b.id === newBusiness.id)?.bid ?? 0);
      setShowConfetti(true);
      play(isLeader ? 'levelup' : 'coin');
      setTimeout(() => setShowConfetti(false), 3000);
    },
    [play, setAppState, appState],
  );

  const handlePublish = useCallback(
    (data: {
      category: CategoryId;
      subcategory: string;
      name: string;
      bid: number;
      whatsapp: string;
      instagram: string;
      slogan: string;
      imageUrl: string;
    }) => {
      const newBusiness: Business = {
        id: 'pub-' + Date.now(),
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        bid: data.bid,
        owner: 'Vos',
        address: 'Villaguay, Entre Ríos',
        image: data.imageUrl || '',
        whatsapp: data.whatsapp.startsWith('http') ? data.whatsapp : `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`,
        instagram: data.instagram.startsWith('http') ? data.instagram : `https://instagram.com/${data.instagram.replace('@', '')}`,
        slogan: data.slogan || 'Nuevo comercio en el ranking',
        daysAtTop: 0,
        clickCount: 0,
      };

      setAppState((prev) => {
        if (!prev) return prev;
        const catLabel = categories.find((c) => c.id === data.category)?.label || '';
        const subLabel = categories.find((c) => c.id === data.category)?.subcategories.find((s) => s.id === data.subcategory)?.label || '';
        const newEvent: LiveEvent = {
          id: 'pub-event-' + Date.now(),
          message: `🆕 ${data.name} se sumó al ranking de ${catLabel}${subLabel ? ` · ${subLabel}` : ''} con ${formatARS(data.bid)}`,
          timeAgo: 'hace instantes',
          category: data.category,
        };
        const next: AppState = {
          ...prev,
          businesses: [...prev.businesses, newBusiness],
          events: [newEvent, ...prev.events],
        };
        saveState(next);
        return next;
      });

      setShowConfetti(true);
      play('coin');
      setTimeout(() => setShowConfetti(false), 3000);
    },
    [play, setAppState],
  );

  const handleOutbid = useCallback((business: Business) => {
    play('click');
    setOutbidTarget(business);
    setOutbidOpen(true);
  }, [play]);

  const handleEmptyBid = useCallback(() => {
    play('click');
    setOutbidTarget(null);
    setOutbidOpen(true);
  }, [play]);

  const handleLastPositionJoin = useCallback(() => {
    play('click');
    setOutbidTarget(null);
    setLastPositionOpen(true);
  }, [play]);

  const handleClaim = useCallback((business: Business) => {
    play('click');
    setClaimTarget(business);
    setClaimOpen(true);
  }, [play]);

  if (!isMounted || !appState) {
    return (
      <div className="min-h-screen bg-panel flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  const allBusinesses = appState.businesses;
  const allEvents = appState.events;

  const rankedBusinesses = getBusinessesByCategory(selectedCategory, selectedSubcategory, allBusinesses);
  const leader = rankedBusinesses[0];
  const rest = rankedBusinesses.slice(1);
  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const currentSub = currentCategory?.subcategories.find((s) => s.id === selectedSubcategory);
  const isEmpty = rankedBusinesses.length === 0;

  const currentLowestBid = rankedBusinesses.length > 0
    ? rankedBusinesses[rankedBusinesses.length - 1].bid
    : MIN_BID;

  const outbidTargetPosition = outbidTarget
    ? rankedBusinesses.findIndex((b) => b.id === outbidTarget.id) + 1
    : 1;

  return (
    <div className="min-h-screen">
      <Confetti active={showConfetti} />

      <Ticker events={allEvents} />

      <Header onOpenReglamento={() => setReglamentoOpen(true)} onOpenPublicar={() => setPublicarOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-6 sm:mb-8">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-foreground">Competí por el </span>
            <span className="neon-text-gold">#1</span>
            <span className="text-foreground"> de Villaguay</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-body mt-3 max-w-2xl mx-auto text-balance">
            Los comercios pujan en tiempo real para ocupar el puesto más alto del ranking.
            Destroná al líder, dominá tu categoría y conquistá la atención de toda la ciudad.
          </p>
        </motion.div>

        {/* Global Leaders */}
        <GlobalLeaders businesses={allBusinesses} onClaim={handleClaim} />

        {/* Month Countdown */}
        <MonthCountdown />

        {/* Monthly reset banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 glass-panel rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-neon-purple/20"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-purple/15 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-neon-purple" />
          </div>
          <p className="text-xs sm:text-sm font-body text-muted-foreground leading-relaxed">
            <span className="text-neon-purple font-semibold">Ciclos Mensuales:</span>{' '}
            Los rankings se compiten del 1 al último día de cada mes. El día 1 de cada mes los valores se reinician a{' '}
            <span className="text-neon-gold font-bold">{formatARS(MIN_BID)}</span> para dar lugar a una nueva competencia mensual.
          </p>
        </motion.div>

        {/* Category selector */}
        <div className="mb-6">
          <CategorySelector
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
          />
        </div>

        {/* Leaderboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + (selectedSubcategory || '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-5"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Ranking {currentCategory?.emoji} {currentCategory?.label}
                {currentSub && <span className="text-muted-foreground font-body text-sm font-normal"> · {currentSub.label}</span>}
              </h3>
              <span className="text-xs text-muted-foreground font-body">
                {rankedBusinesses.length} {rankedBusinesses.length === 1 ? 'comercio compitiendo' : 'comercios compitiendo'}
              </span>
            </div>

            {/* Empty state */}
            {isEmpty ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-8 sm:p-12 text-center space-y-4 border border-neon-gold/20"
              >
                <div className="w-16 h-16 rounded-full bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-neon-gold" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-foreground mb-2">¡Estrená esta categoría!</h4>
                  <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
                    No hay comercios compitiendo en {currentCategory?.label}{currentSub ? ` · ${currentSub.label}` : ''} todavía.
                    Sé el primero en pujar y ocupá el puesto #1.
                  </p>
                </div>
                <button
                  onClick={handleEmptyBid}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all"
                >
                  <Crown className="h-4 w-4" />
                  Ocupar el #1 por {formatARS(MIN_BID)}
                </button>
              </motion.div>
            ) : (
              <>
                {leader && <LeaderCard business={leader} onOutbid={handleOutbid} onClaim={handleClaim} />}
                <div className="space-y-3">
                  <AnimatePresence>
                    {rest.map((business, index) => (
                      <CompactCard
                        key={business.id}
                        business={business}
                        position={index + 2}
                        topBid={leader.bid}
                        onOutbid={handleOutbid}
                        onClaim={handleClaim}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <LastPositionCard
                  onJoin={handleLastPositionJoin}
                  currentLowestBid={currentLowestBid}
                  discount={appState.lastPositionDiscount}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5">
          {/* Global Metrics Panel */}
          <div className="glass-panel rounded-xl p-4 mb-6 border border-neon-purple/20">
            <div className="flex items-center justify-around gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-neon-purple" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Visitas Totales</p>
                  <p className="text-sm font-display font-bold text-neon-purple">{appState.totalVisits.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
                  <Store className="h-4 w-4 text-neon-green" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Comercios Activos</p>
                  <p className="text-sm font-display font-bold text-neon-green">{allBusinesses.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground/50 font-body">
              VILLAGUAY OUTBID — Plataforma competitiva para comercios de Villaguay, Entre Ríos.
            </p>
            <p className="text-xs text-muted-foreground/40 font-body mt-1">
              Prototipo Beta · Las pujas se validan mediante comprobante por WhatsApp.
            </p>
            <button
              onClick={() => router.push('/admin')}
              className="mt-3 inline-flex items-center gap-1 text-[10px] text-muted-foreground/20 hover:text-muted-foreground/60 font-body transition-colors"
            >
              <Lock className="h-2.5 w-2.5" />
              Admin
            </button>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <ReglamentoModal open={reglamentoOpen} onOpenChange={setReglamentoOpen} />
      <PublicarComercioModal open={publicarOpen} onOpenChange={setPublicarOpen} onPublish={handlePublish} />
      <OutbidModal
        business={outbidTarget}
        open={outbidOpen}
        onOpenChange={setOutbidOpen}
        category={selectedCategory}
        subcategory={selectedSubcategory}
        currentPosition={outbidTargetPosition}
        rankedCount={rankedBusinesses.length}
        onConfirm={handleConfirmBid}
      />
      <LastPositionModal
        open={lastPositionOpen}
        onOpenChange={setLastPositionOpen}
        category={selectedCategory}
        subcategory={selectedSubcategory}
        discountedPrice={Math.round(currentLowestBid * (appState.lastPositionDiscount / 100))}
      />
      {claimTarget && (
        <ClaimBusinessModal
          open={claimOpen}
          onOpenChange={setClaimOpen}
          business={claimTarget}
        />
      )}
    </div>
  );
}
