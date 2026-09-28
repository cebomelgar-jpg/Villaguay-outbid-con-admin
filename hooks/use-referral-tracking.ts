import { useEffect, useState, useCallback } from 'react';

const REFERRAL_STORAGE_KEY = 'villaguay-referral';
const REFERRAL_EXPIRY_HOURS = 24;
const MIN_SESSION_TIME_MS = 5000; // 5 segundos mínimos
const BOT_PATTERNS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java',
  'headless', 'phantom', 'selenium', 'puppeteer', 'googlebot', 'bingbot',
  'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebookexternalhit'
];

interface ReferralData {
  refKey: string | null;
  timestamp: number;
  hasInteracted: boolean;
  sessionStartTime: number;
}

export function useReferralTracking() {
  const [isMounted, setIsMounted] = useState(false);
  const [refKey, setRefKey] = useState<string | null>(null);
  const [isQualifiedVisit, setIsQualifiedVisit] = useState(false);
  const [sessionStartTime] = useState(() => Date.now());

  // Detectar si es un bot
  const isBot = useCallback(() => {
    if (typeof window === 'undefined') return true;
    const userAgent = navigator.userAgent.toLowerCase();
    return BOT_PATTERNS.some(pattern => userAgent.includes(pattern));
  }, []);

  // Generar hash del visitante (simulado - en producción usar IP real del servidor)
  const generateVisitorHash = useCallback(() => {
    if (typeof window === 'undefined') return 'server-hash';
    
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenInfo = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // En producción, esto debería incluir la IP real del servidor
    const combined = `${userAgent}-${language}-${screenInfo}-${timezone}`;
    return btoa(combined).substring(0, 32);
  }, []);

  // Detectar parámetro de referido en URL
  const detectReferralFromURL = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('ref') || urlParams.get('pub');
    } catch {
      return null;
    }
  }, []);

  // Guardar referido en localStorage
  const saveReferral = useCallback((key: string) => {
    const data: ReferralData = {
      refKey: key,
      timestamp: Date.now(),
      hasInteracted: false,
      sessionStartTime: Date.now(),
    };
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
    setRefKey(key);
  }, []);

  // Cargar referido desde localStorage
  const loadReferral = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!stored) return null;
      
      const data: ReferralData = JSON.parse(stored);
      const hoursElapsed = (Date.now() - data.timestamp) / (1000 * 60 * 60);
      
      // Expirar después de 24 horas
      if (hoursElapsed >= REFERRAL_EXPIRY_HOURS) {
        localStorage.removeItem(REFERRAL_STORAGE_KEY);
        return null;
      }
      
      setRefKey(data.refKey);
      return data.refKey;
    } catch {
      return null;
    }
  }, []);

  // Marcar interacción del usuario
  const markInteraction = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!stored) return;
      
      const data: ReferralData = JSON.parse(stored);
      data.hasInteracted = true;
      localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorar errores
    }
  }, []);

  // Verificar si la visita califica para registrar punto
  const checkQualification = useCallback(() => {
    if (!refKey || isBot()) return false;
    
    const sessionTime = Date.now() - sessionStartTime;
    const hasMinTime = sessionTime >= MIN_SESSION_TIME_MS;
    
    try {
      const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!stored) return false;
      
      const data: ReferralData = JSON.parse(stored);
      return hasMinTime && data.hasInteracted;
    } catch {
      return false;
    }
  }, [refKey, sessionStartTime, isBot]);

  // Inicializar tracking
  useEffect(() => {
    setIsMounted(true);
    
    if (isBot()) return;

    // Primero intentar cargar del localStorage
    const storedRef = loadReferral();
    
    // Si no hay referido almacenado, buscar en URL
    if (!storedRef) {
      const urlRef = detectReferralFromURL();
      if (urlRef) {
        saveReferral(urlRef);
      }
    }

    // Verificar calificación periódicamente
    const checkInterval = setInterval(() => {
      const qualified = checkQualification();
      if (qualified && !isQualifiedVisit) {
        setIsQualifiedVisit(true);
      }
    }, 1000);

    // Event listeners para interacción
    const handleInteraction = () => markInteraction();
    
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [isBot, loadReferral, detectReferralFromURL, saveReferral, markInteraction, checkQualification, isQualifiedVisit]);

  return {
    refKey,
    isQualifiedVisit,
    visitorHash: isMounted ? generateVisitorHash() : 'server-hash',
    markInteraction,
  };
}