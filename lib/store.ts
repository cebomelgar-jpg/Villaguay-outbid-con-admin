import type { Business, LiveEvent, CategoryId } from './mockData';

export interface PendingBid {
  id: string;
  business: Business;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface AppState {
  businesses: Business[];
  events: LiveEvent[];
  pendingBids: PendingBid[];
  adminPassword: string;
  currentMonth: string;
  totalVisits: number;
}

const STORAGE_KEY = 'villaguay-outbid-state';
const EVENT_NAME = 'villaguay-outbid-update';

function getDefaultState(): AppState {
  return {
    businesses: [],
    events: [
      { id: 'e1', message: '🔥 Villaguay Outbid reinicia sus rankings — ¡Estrená tu categoría este mes!', timeAgo: 'hace 1h', category: 'gastronomia' },
      { id: 'e2', message: '📅 Ciclo mensual activo: del 1 al último día de cada mes. ¡Compite!', timeAgo: 'hace 2h', category: 'gastronomia' },
      { id: 'e3', message: '👑 Sé el primero en ocupar el #1 de tu rubro en Villaguay', timeAgo: 'hace 3h', category: 'estetica' },
    ],
    pendingBids: [],
    adminPassword: 'admin123',
    currentMonth: new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' }),
    totalVisits: 0,
  };
}

export function getStoredState(): AppState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const def = getDefaultState();

    // Migrate existing businesses to include clickCount
    const migratedBusinesses = (parsed.businesses ?? def.businesses).map((biz: Business) => ({
      ...biz,
      clickCount: biz.clickCount ?? 0,
    }));

    return {
      businesses: migratedBusinesses,
      events: parsed.events ?? def.events,
      pendingBids: parsed.pendingBids ?? def.pendingBids,
      adminPassword: parsed.adminPassword ?? def.adminPassword,
      currentMonth: parsed.currentMonth ?? def.currentMonth,
      totalVisits: parsed.totalVisits ?? def.totalVisits,
    };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribeToState(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

export function getCurrentMonthLabel(): string {
  return new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' });
}

export function incrementTotalVisits(): void {
  const state = getStoredState();
  state.totalVisits += 1;
  saveState(state);
}

export function incrementBusinessClick(businessId: string): void {
  const state = getStoredState();
  const businesses = state.businesses.map((biz) =>
    biz.id === businessId ? { ...biz, clickCount: biz.clickCount + 1 } : biz
  );
  saveState({ ...state, businesses });
}
