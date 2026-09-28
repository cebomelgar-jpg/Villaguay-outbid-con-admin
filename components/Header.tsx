'use client';

import { motion } from 'framer-motion';
import { Radio, BookOpen, Store, Wrench, Trophy } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onOpenReglamento: () => void;
  onOpenPublicar: () => void;
}

export function Header({ onOpenReglamento, onOpenPublicar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <Link href="/" className="flex flex-col">
                <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-none">
                  <span className="neon-text-green">VILLAGUAY</span>{' '}
                  <span className="neon-text-purple">OUTBID</span>
                </h1>
                <span className="text-[10px] sm:text-xs text-muted-foreground/60 font-body tracking-widest uppercase mt-0.5">
                  Leaderboard Competitivo
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tournament Banner */}
            <Link
              href="/ranking-publicistas"
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-neon-gold/15 border border-neon-gold/40 text-neon-gold text-xs sm:text-sm font-display font-bold hover:bg-neon-gold/25 transition-all"
            >
              <Trophy className="h-4 w-4" />
              <span>Torneo $100k</span>
            </Link>

            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-live-pulse"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-green"></span>
              </span>
              <span className="text-xs font-display font-bold text-neon-green tracking-wide">
                LIVE
              </span>
            </div>

            {/* Mobile Tournament Banner */}
            <Link
              href="/ranking-publicistas"
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neon-gold/15 border border-neon-gold/40 text-neon-gold text-xs font-display font-bold"
            >
              <Trophy className="h-4 w-4" />
            </Link>

            {/* Oficios */}
            <Link
              href="/oficios"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg glass-panel-hover text-xs sm:text-sm font-body font-medium text-foreground/80 hover:text-neon-green transition-colors"
            >
              <Wrench className="h-4 w-4 text-neon-green" />
              <span className="hidden sm:inline">Oficios & Changas</span>
            </Link>

            {/* Reglamento */}
            <button
              onClick={onOpenReglamento}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg glass-panel-hover text-xs sm:text-sm font-body font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4 text-neon-purple" />
              <span className="hidden sm:inline">Ver Reglamento</span>
            </button>

            {/* Publicar */}
            <button
              onClick={onOpenPublicar}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-neon-green text-obsidian text-xs sm:text-sm font-display font-bold hover:bg-neon-green/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,135,0.4)]"
            >
              <Store className="h-4 w-4" />
              <span>Publicar mi Comercio</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
