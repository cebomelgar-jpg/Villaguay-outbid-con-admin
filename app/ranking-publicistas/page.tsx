'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Clock, Users, Award } from 'lucide-react';
import { PublicistaRegisterModal } from '@/components/PublicistaRegisterModal';
import { toast } from 'sonner';

interface Publicista {
  id: string;
  nombre_usuario: string;
  nombre_publico: string;
  ref_key: string;
  whatsapp_contacto: string;
  created_at: string;
  puntos_mes_actual: number;
}

interface Competencia {
  id: string;
  titulo: string;
  monto_premio: number;
  fecha_inicio: string;
  fecha_fin: string;
  esta_activo: boolean;
}

export default function RankingPublicistasPage() {
  const [ranking, setRanking] = useState<Publicista[]>([]);
  const [competencia, setCompetencia] = useState<Competencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/publicistas/ranking');
        if (!response.ok) throw new Error('Error cargando ranking');
        
        const data = await response.json();
        setRanking(data.ranking || []);
        setCompetencia(data.competencia);
      } catch (error) {
        toast.error('Error al cargar el ranking');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!competencia?.fecha_fin) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(competencia.fecha_fin).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [competencia]);

  const formatARS = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (position === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getMedalColor = (position: number) => {
    if (position === 1) return 'border-yellow-400/50 bg-yellow-400/10';
    if (position === 2) return 'border-gray-300/50 bg-gray-300/10';
    if (position === 3) return 'border-amber-600/50 bg-amber-600/10';
    return 'border-white/10';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-panel flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-panel">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neon-gold/20 via-amber-500/20 to-neon-gold/20 border-b border-neon-gold/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-gold mb-2">
                🏆 Torneo de Publicistas
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                {competencia?.titulo || 'Torneo Mensual de Publicistas'}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">Pozo Acumulado</p>
                <p className="text-2xl sm:text-3xl font-display font-bold text-neon-gold">
                  {competencia ? formatARS(competencia.monto_premio) : formatARS(100000)}
                </p>
              </div>

              <div className="glass-panel rounded-xl p-4 border border-neon-gold/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-neon-gold" />
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Tiempo Restante</p>
                </div>
                <div className="flex items-center gap-2 text-lg font-display font-bold text-neon-gold">
                  <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-4 border border-neon-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-neon-purple" />
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Publicistas</p>
            </div>
            <p className="text-2xl font-display font-bold text-neon-purple">{ranking.length}</p>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-neon-green/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-neon-green" />
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Visitas Totales</p>
            </div>
            <p className="text-2xl font-display font-bold text-neon-green">
              {ranking.reduce((sum, p) => sum + p.puntos_mes_actual, 0)}
            </p>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-neon-gold/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-neon-gold" />
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Líder</p>
            </div>
            <p className="text-lg font-display font-bold text-neon-gold truncate">
              {ranking[0]?.nombre_publico || '-'}
            </p>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-neon-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-neon-purple" />
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Premio</p>
            </div>
            <p className="text-lg font-display font-bold text-neon-gold">
              {competencia ? formatARS(competencia.monto_premio) : formatARS(100000)}
            </p>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-neon-gold" />
              Tabla de Posiciones
            </h2>
          </div>

          {ranking.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-neon-gold" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Aún no hay publicistas
              </h3>
              <p className="text-sm text-muted-foreground font-body mb-6">
                Sé el primero en sumarte al torneo y empezar a competir
              </p>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all"
              >
                <Award className="h-4 w-4" />
                Sumate al Torneo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {ranking.slice(0, 10).map((publicista, index) => (
                  <motion.div
                    key={publicista.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${getMedalColor(index + 1)}`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 font-display font-bold text-lg">
                      {getMedalIcon(index + 1) || `#${index + 1}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-foreground truncate">
                        {publicista.nombre_publico}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        @{publicista.nombre_usuario}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display font-bold text-neon-gold text-lg">
                        {publicista.puntos_mes_actual}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">puntos</p>
                    </div>

                    <div className="flex items-center gap-1 text-neon-green">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-body font-medium">🔥</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <div className="glass-panel rounded-2xl p-8 border border-neon-gold/20">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              ¿Querés sumarte al torneo?
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-6 max-w-md mx-auto">
              Creá tu cuenta de publicista, obtené tu enlace único y empezá a ganar puntos por cada visita que traigas a la plataforma
            </p>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-gold to-amber-400 text-obsidian font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all"
            >
              <Award className="h-4 w-4" />
              Crear mi Link de Publicista
            </button>
          </div>
        </div>
      </main>

      <PublicistaRegisterModal
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
      />
    </div>
  );
}