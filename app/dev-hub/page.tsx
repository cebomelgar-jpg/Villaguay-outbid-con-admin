'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Globe,
  Lock,
  Smartphone,
  Database,
  RefreshCw,
  ArrowRight,
  Code,
  Zap,
  Settings,
  ExternalLink,
} from 'lucide-react';
import {
  getStoredState,
  saveState,
  type AppState,
} from '@/lib/store';
import {
  categories,
  MIN_BID,
  type Business,
  type LiveEvent,
} from '@/lib/mockData';

export default function DevHubPage() {
  const router = useRouter();
  const [mobilePreview, setMobilePreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadTestData = () => {
    setLoading(true);
    const testBusinesses: Business[] = [
      {
        id: 'test-1',
        name: 'La Parrilla de Villaguay',
        category: 'gastronomia',
        subcategory: 'restaurantes',
        bid: 2500,
        owner: 'Juan Pérez',
        address: 'Belgrano 450, Villaguay',
        image: '',
        whatsapp: 'https://wa.me/5493455424321',
        instagram: 'https://instagram.com/parrillavillaguay',
        slogan: 'La mejor carne a las brasas',
        daysAtTop: 15,
        clickCount: 142,
      },
      {
        id: 'test-2',
        name: 'Cervecería del Centro',
        category: 'gastronomia',
        subcategory: 'bares',
        bid: 1800,
        owner: 'María González',
        address: 'San Martín 230, Villaguay',
        image: '',
        whatsapp: 'https://wa.me/5493455123456',
        instagram: 'https://instagram.com/cervezacentro',
        slogan: 'Birras artesanales todos los días',
        daysAtTop: 8,
        clickCount: 85,
      },
      {
        id: 'test-3',
        name: 'Barbería Estilo',
        category: 'estetica',
        subcategory: 'peluquerias',
        bid: 1500,
        owner: 'Carlos López',
        address: 'Rivadavia 120, Villaguay',
        image: '',
        whatsapp: 'https://wa.me/5493455789012',
        instagram: 'https://instagram.com/barberiaestilo',
        slogan: 'Cortes modernos y clásicos',
        daysAtTop: 5,
        clickCount: 63,
      },
      {
        id: 'test-4',
        name: 'Gimnasio Power',
        category: 'salud',
        subcategory: 'gimnasios',
        bid: 2000,
        owner: 'Martín Rodríguez',
        address: 'Av. Uruguay 500, Villaguay',
        image: '',
        whatsapp: 'https://wa.me/5493455345678',
        instagram: 'https://instagram.com/gimnasiopower',
        slogan: 'Tu mejor versión empieza aquí',
        daysAtTop: 12,
        clickCount: 94,
      },
      {
        id: 'test-5',
        name: 'Tienda Deportiva',
        category: 'indumentaria',
        subcategory: 'ropa_fm',
        bid: 1200,
        owner: 'Ana Martínez',
        address: '25 de Mayo 80, Villaguay',
        image: '',
        whatsapp: 'https://wa.me/5493455567890',
        instagram: 'https://instagram.com/tiendadeportiva',
        slogan: 'Ropa para todas las actividades',
        daysAtTop: 3,
        clickCount: 47,
      },
    ];

    const testEvents: LiveEvent[] = [
      {
        id: 'e1',
        message: '🔥 ¡La Parrilla de Villaguay lidera el ranking de Gastronomía!',
        timeAgo: 'hace 10 min',
        category: 'gastronomia',
      },
      {
        id: 'e2',
        message: '🆕 Gimnasio Power se sumó al ranking de Salud con $2.000 ARS',
        timeAgo: 'hace 25 min',
        category: 'salud',
      },
      {
        id: 'e3',
        message: '📅 Ciclo mensual activo: del 1 al último día de cada mes. ¡Compite!',
        timeAgo: 'hace 1h',
        category: 'gastronomia',
      },
    ];

    const newState: AppState = {
      businesses: testBusinesses,
      events: testEvents,
      pendingBids: [],
      businessClaims: [],
      customCategories: [],
      globalTexts: {
        siteTitle: 'VILLAGUAY OUTBID',
        siteSubtitle: 'El Ranking Comercial de Villaguay',
        welcomeMessage: '¡Bienvenido al ranking comercial más competitivo de Villaguay!',
        heroTitle: '¡Compite por el #1!',
        heroSubtitle: 'El mejor comercio de cada rubro se lleva el trono este mes',
      },
      adminPassword: 'admin123',
      currentMonth: new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' }),
      totalVisits: 1250,
      lastPositionDiscount: 50,
      version: '3.0',
    };

    saveState(newState);
    setTimeout(() => {
      setLoading(false);
      alert('Datos de prueba cargados correctamente');
    }, 500);
  };

  const handleResetState = () => {
    if (confirm('¿Estás seguro de que quieres resetear el estado local? Se eliminarán todos los datos.')) {
      localStorage.removeItem('villaguay-outbid-state');
      sessionStorage.removeItem('villaguay-admin-authed');
      window.location.reload();
    }
  };

  const handleMobilePreview = () => {
    setMobilePreview(true);
    window.open('/', '_blank', 'width=375,height=667');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="glass-panel border-b border-white/5 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
                <Code className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg font-bold text-foreground leading-none">Dev Hub</h1>
                <span className="text-[10px] text-muted-foreground/60 font-body">VILLAGUAY OUTBID — Entorno de Desarrollo</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-panel-hover text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Ir al sitio
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-panel rounded-2xl p-6 border border-neon-green/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
              <Zap className="h-6 w-6 text-neon-green" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-2">Centro de Desarrollo</h2>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Este es un entorno de pruebas local. Desde aquí puedes navegar rápidamente entre las diferentes vistas,
                cargar datos de prueba para Villaguay, y acceder al panel de administración con credenciales preconfiguradas.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Public View */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-neon-purple/30 transition-all cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center group-hover:bg-neon-purple/25 transition-all">
                <Globe className="h-6 w-6 text-neon-purple" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-foreground mb-1">Vista Pública</h3>
                <p className="text-xs text-muted-foreground font-body mb-3">Leaderboard principal que ven los usuarios</p>
                <div className="flex items-center gap-1 text-xs text-neon-purple font-body font-medium">
                  <span>Abrir</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Admin Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-neon-green/30 transition-all cursor-pointer group"
            onClick={() => router.push('/admin')}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-green/15 border border-neon-green/40 flex items-center justify-center group-hover:bg-neon-green/25 transition-all">
                <Lock className="h-6 w-6 text-neon-green" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-foreground mb-1">Panel Admin</h3>
                <p className="text-xs text-muted-foreground font-body mb-3">Gestión de rankings, pujas y configuración</p>
                <div className="glass-panel rounded-lg px-3 py-2 inline-block">
                  <p className="text-[10px] text-muted-foreground font-body mb-1">Credenciales:</p>
                  <p className="text-xs text-neon-green font-body font-medium">Usuario: admin</p>
                  <p className="text-xs text-neon-green font-body font-medium">Contraseña: admin123</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tools section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center">
              <Settings className="h-5 w-5 text-neon-gold" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Herramientas de Desarrollo</h3>
              <p className="text-xs text-muted-foreground font-body">Utilidades para pruebas locales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Load test data */}
            <button
              onClick={handleLoadTestData}
              disabled={loading}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass-panel-hover text-left hover:bg-neon-green/10 hover:border-neon-green/30 transition-all disabled:opacity-50"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
                <Database className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <p className="text-sm font-display font-bold text-foreground">Cargar Datos de Prueba</p>
                <p className="text-xs text-muted-foreground font-body">Comercios de Villaguay de ejemplo</p>
              </div>
              {loading && <RefreshCw className="h-4 w-4 text-neon-green animate-spin ml-auto" />}
            </button>

            {/* Mobile preview */}
            <button
              onClick={handleMobilePreview}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass-panel-hover text-left hover:bg-neon-purple/10 hover:border-neon-purple/30 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-neon-purple" />
              </div>
              <div>
                <p className="text-sm font-display font-bold text-foreground">Simulador Mobile</p>
                <p className="text-xs text-muted-foreground font-body">Abrir en ventana de 375x667px</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </button>

            {/* Reset state */}
            <button
              onClick={handleResetState}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass-panel-hover text-left hover:bg-destructive/10 hover:border-destructive/30 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/15 border border-destructive/40 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-display font-bold text-foreground">Resetear Estado Local</p>
                <p className="text-xs text-muted-foreground font-body">Limpiar todos los datos guardados</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Info footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/40 font-body">
            Dev Hub — Entorno de desarrollo local para VILLAGUAY OUTBID
          </p>
          <p className="text-[10px] text-muted-foreground/30 font-body mt-1">
            Los cambios se guardan en localStorage del navegador
          </p>
        </div>
      </div>
    </div>
  );
}
