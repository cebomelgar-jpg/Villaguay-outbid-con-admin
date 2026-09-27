import type { Business, LiveEvent, CategoryId } from './mockData';
import { villaguayCatalog } from '@/src/data/villaguaySeed';
import { oficiosSeed, type Oficio } from './oficiosData';

export interface PendingBid {
  id: string;
  business: Business;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  receiptImage?: string;
}

export interface BusinessClaim {
  id: string;
  businessId: string;
  ownerName: string;
  ownerPhone: string;
  ownerInstagram: string;
  verificationMethod: 'dni' | 'receipt' | 'social';
  verificationUrl: string; // Base64 image or URL
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  subcategories: CustomSubcategory[];
}

export interface CustomSubcategory {
  id: string;
  name: string;
  order: number;
}

export interface GlobalTexts {
  siteTitle: string;
  siteSubtitle: string;
  welcomeMessage: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface AppState {
  businesses: Business[];
  events: LiveEvent[];
  pendingBids: PendingBid[];
  businessClaims: BusinessClaim[];
  customCategories: CustomCategory[];
  globalTexts: GlobalTexts;
  adminPassword: string;
  currentMonth: string;
  totalVisits: number;
  lastPositionDiscount: number;
  oficios: Oficio[];
  pendingOficios: PendingOficio[];
  version: string;
}

export interface PendingOficio {
  id: string;
  name: string;
  trade: string;
  zone: string;
  whatsapp: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedAt?: number;
}

const STORAGE_KEY = 'villaguay-outbid-state';
const EVENT_NAME = 'villaguay-outbid-update';
const CURRENT_VERSION = '5.1'; // Villaguay catalog + moderation fields

function getDefaultState(): AppState {
  return {
    businesses: villaguayCatalog,
    events: [
      { id: 'e1', message: '🔥 Villaguay Outbid reinicia sus rankings — ¡Estrená tu categoría este mes!', timeAgo: 'hace 1h', category: 'gastronomia' },
      { id: 'e2', message: '📅 Ciclo mensual activo: del 1 al último día de cada mes. ¡Compite!', timeAgo: 'hace 2h', category: 'gastronomia' },
      { id: 'e3', message: '👑 Sé el primero en ocupar el #1 de tu rubro en Villaguay', timeAgo: 'hace 3h', category: 'estetica' },
    ],
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
    totalVisits: 0,
    lastPositionDiscount: 50,
    oficios: oficiosSeed,
    pendingOficios: [],
    version: CURRENT_VERSION,
  };
}

export function getStoredState(): AppState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const def = getDefaultState();

    // Check version - if old version or missing, reset to seed data
    if (!parsed.version || parsed.version !== CURRENT_VERSION) {
      console.log('Old data version detected, resetting to seed data');
      localStorage.removeItem(STORAGE_KEY);
      return getDefaultState();
    }

    // Migrate existing businesses to include new fields
    const migratedBusinesses = (parsed.businesses ?? def.businesses).map((biz: Business) => ({
      ...biz,
      clickCount: biz.clickCount ?? 0,
      images: biz.images ?? [],
      description: biz.description ?? '',
      services: biz.services ?? [],
      businessHours: biz.businessHours ?? {},
      socialLinks: biz.socialLinks ?? {
        whatsapp: biz.whatsapp || '',
        instagram: biz.instagram || '',
        googleMaps: biz.googleMaps || '',
      },
      status: biz.status ?? 'active',
    }));

    return {
      businesses: migratedBusinesses,
      events: parsed.events ?? def.events,
      pendingBids: parsed.pendingBids ?? def.pendingBids,
      businessClaims: parsed.businessClaims ?? def.businessClaims,
      customCategories: parsed.customCategories ?? def.customCategories,
      globalTexts: parsed.globalTexts ?? def.globalTexts,
      adminPassword: parsed.adminPassword ?? def.adminPassword,
      currentMonth: parsed.currentMonth ?? def.currentMonth,
      totalVisits: parsed.totalVisits ?? def.totalVisits,
      lastPositionDiscount: parsed.lastPositionDiscount ?? def.lastPositionDiscount,
      oficios: parsed.oficios ?? def.oficios,
      pendingOficios: parsed.pendingOficios ?? def.pendingOficios,
      version: CURRENT_VERSION,
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

export function updateLastPositionDiscount(discount: number): void {
  const state = getStoredState();
  saveState({ ...state, lastPositionDiscount: discount });
}

export function resetToSeedData(): void {
  const def = getDefaultState();
  saveState(def);
  window.location.reload();
}

// Business Claim functions
export function submitBusinessClaim(claim: Omit<BusinessClaim, 'id' | 'submittedAt' | 'status'>): void {
  const state = getStoredState();
  const newClaim: BusinessClaim = {
    ...claim,
    id: `claim-${Date.now()}`,
    submittedAt: Date.now(),
    status: 'pending',
  };
  saveState({ ...state, businessClaims: [...state.businessClaims, newClaim] });
}

export function approveBusinessClaim(claimId: string): void {
  const state = getStoredState();
  const claim = state.businessClaims.find(c => c.id === claimId);
  if (!claim) return;

  const businesses = state.businesses.map(biz =>
    biz.id === claim.businessId
      ? { ...biz, owner: claim.ownerName, whatsapp: `https://wa.me/${claim.ownerPhone.replace(/\D/g, '')}`, instagram: claim.ownerInstagram }
      : biz
  );

  const businessClaims: BusinessClaim[] = state.businessClaims.map(c =>
    c.id === claimId
      ? { ...c, status: 'approved' as const, reviewedAt: Date.now(), reviewedBy: 'admin' }
      : c
  );

  saveState({ ...state, businesses, businessClaims });
}

export function rejectBusinessClaim(claimId: string, reason: string): void {
  const state = getStoredState();
  const businessClaims: BusinessClaim[] = state.businessClaims.map(c =>
    c.id === claimId
      ? { ...c, status: 'rejected' as const, reviewedAt: Date.now(), reviewedBy: 'admin', rejectionReason: reason }
      : c
  );
  saveState({ ...state, businessClaims });
}

// Custom Category functions
export function addCustomCategory(category: Omit<CustomCategory, 'id'>): void {
  const state = getStoredState();
  const newCategory: CustomCategory = {
    ...category,
    id: `custom-cat-${Date.now()}`,
  };
  saveState({ ...state, customCategories: [...state.customCategories, newCategory] });
}

export function updateCustomCategory(categoryId: string, updates: Partial<CustomCategory>): void {
  const state = getStoredState();
  const customCategories = state.customCategories.map(cat =>
    cat.id === categoryId ? { ...cat, ...updates } : cat
  );
  saveState({ ...state, customCategories });
}

export function deleteCustomCategory(categoryId: string): void {
  const state = getStoredState();
  const customCategories = state.customCategories.filter(cat => cat.id !== categoryId);
  saveState({ ...state, customCategories });
}

// Global Texts functions
export function updateGlobalTexts(texts: Partial<GlobalTexts>): void {
  const state = getStoredState();
  saveState({ ...state, globalTexts: { ...state.globalTexts, ...texts } });
}

// Business CRUD functions
export function updateBusiness(businessId: string, updates: Partial<Business>): void {
  const state = getStoredState();
  const businesses = state.businesses.map(biz =>
    biz.id === businessId ? { ...biz, ...updates } : biz
  );
  saveState({ ...state, businesses });
}

export function deleteBusiness(businessId: string): void {
  const state = getStoredState();
  const businesses = state.businesses.filter(biz => biz.id !== businessId);
  saveState({ ...state, businesses });
}

export function createBusiness(business: Omit<Business, 'id'>): void {
  const state = getStoredState();
  const newBusiness: Business = {
    ...business,
    id: `business-${Date.now()}`,
  };
  saveState({ ...state, businesses: [...state.businesses, newBusiness] });
}

// Oficios CRUD functions
export function addOficio(oficio: Omit<Oficio, 'id'>): void {
  const state = getStoredState();
  const newOficio: Oficio = {
    ...oficio,
    id: `oficio-${Date.now()}`,
  };
  saveState({ ...state, oficios: [...state.oficios, newOficio] });
}

export function updateOficio(oficioId: string, updates: Partial<Oficio>): void {
  const state = getStoredState();
  const oficios = state.oficios.map((o) =>
    o.id === oficioId ? { ...o, ...updates } : o
  );
  saveState({ ...state, oficios });
}

export function deleteOficio(oficioId: string): void {
  const state = getStoredState();
  const oficios = state.oficios.filter((o) => o.id !== oficioId);
  saveState({ ...state, oficios });
}

export function submitPendingOficio(data: Omit<PendingOficio, 'id' | 'submittedAt' | 'status'>): void {
  const state = getStoredState();
  const newPending: PendingOficio = {
    ...data,
    id: `pending-of-${Date.now()}`,
    submittedAt: Date.now(),
    status: 'pending',
  };
  saveState({ ...state, pendingOficios: [...state.pendingOficios, newPending] });
}

export function approvePendingOficio(pendingId: string): void {
  const state = getStoredState();
  const pending = state.pendingOficios.find((p) => p.id === pendingId);
  if (!pending) return;
  const newOficio: Oficio = {
    id: `oficio-${Date.now()}`,
    name: pending.name,
    trade: pending.trade,
    zone: pending.zone,
    whatsapp: pending.whatsapp,
    bio: pending.bio,
    rating: 5.0,
    reviews: 0,
    medal: 'nuevo',
    available: true,
  };
  saveState({
    ...state,
    oficios: [...state.oficios, newOficio],
    pendingOficios: state.pendingOficios.map((p) =>
      p.id === pendingId ? { ...p, status: 'approved' as const, reviewedAt: Date.now() } : p
    ),
  });
}

export function rejectPendingOficio(pendingId: string): void {
  const state = getStoredState();
  saveState({
    ...state,
    pendingOficios: state.pendingOficios.map((p) =>
      p.id === pendingId ? { ...p, status: 'rejected' as const, reviewedAt: Date.now() } : p
    ),
  });
}
