'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  LayoutDashboard,
  Inbox,
  Calendar,
  Megaphone,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  Store,
  ChevronLeft,
  Eye,
  EyeOff,
  Settings,
  Upload,
  UserCheck,
  Shield,
  FolderPlus,
  FolderEdit,
  Trash,
  Type,
  Image as ImageIcon,
  MapPin,
  Phone,
  Globe,
  Clock,
  Hash,
  Layers,
  FileText,
  GripVertical,
  Wrench,
  Star,
  Award,
} from 'lucide-react';
import {
  getStoredState,
  saveState,
  subscribeToState,
  getCurrentMonthLabel,
  updateLastPositionDiscount,
  resetToSeedData,
  submitBusinessClaim,
  approveBusinessClaim,
  rejectBusinessClaim,
  addCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
  updateGlobalTexts,
  updateBusiness,
  deleteBusiness,
  createBusiness,
  addOficio,
  updateOficio,
  deleteOficio,
  approvePendingOficio,
  rejectPendingOficio,
  type AppState,
  type PendingBid,
  type BusinessClaim,
  type CustomCategory,
  type GlobalTexts,
  type PendingOficio,
} from '@/lib/store';
import { processImage, getCategoryPlaceholder, MAX_GALLERY_IMAGES } from '@/lib/imageUtils';
import {
  categories,
  formatARS,
  MIN_BID,
  type CategoryId,
  type Business,
  type LiveEvent,
  type BusinessStatus,
} from '@/lib/mockData';
import { OFICIO_TRADES, VILLAGUAY_ZONES, type Oficio, type Medal } from '@/lib/oficiosData';

type Tab = 'rankings' | 'pending' | 'claims' | 'categories' | 'content' | 'season' | 'marquee' | 'metrics' | 'oficios' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('rankings');

  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredState();
    const sessionAuthed = sessionStorage.getItem('villaguay-admin-authed') === 'true';
    if (sessionAuthed) {
      setAuthed(true);
      setState(stored);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const unsub = subscribeToState(() => {
      setState(getStoredState());
    });
    return unsub;
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredState();
    if (password === stored.adminPassword) {
      setAuthed(true);
      setState(stored);
      setError(false);
      sessionStorage.setItem('villaguay-admin-authed', 'true');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('villaguay-admin-authed');
    setAuthed(false);
    setPassword('');
    router.push('/');
  };

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveState(next);
      return next;
    });
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-panel flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="glass-panel rounded-2xl p-8 space-y-6 border border-neon-purple/20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-neon-purple" />
              </div>
              <h1 className="font-display text-2xl font-bold neon-text-purple">Admin Panel</h1>
              <p className="text-xs text-muted-foreground font-body mt-1">VILLAGUAY OUTBID — Acceso Restringido</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg glass-panel text-sm font-body text-foreground text-center focus:outline-none transition-colors ${error ? 'border-destructive/50' : 'focus:border-neon-purple/50'}`}
                />
                {error && <p className="text-[10px] text-destructive font-body mt-1.5 text-center">Contraseña incorrecta</p>}
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-purple text-white font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all">
                <Lock className="h-4 w-4" /> Ingresar
              </button>
            </form>
            <p className="text-[10px] text-muted-foreground/40 font-body text-center">Contraseña por defecto: admin123</p>
            <button onClick={() => router.push('/')} className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" /> Volver al sitio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!state) return null;

  return (
    <div className="min-h-screen">
      {/* Admin header */}
      <div className="glass-panel border-b border-white/5 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-neon-purple" />
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg font-bold text-foreground leading-none">Admin Panel</h1>
                <span className="text-[10px] text-muted-foreground/60 font-body">VILLAGUAY OUTBID</span>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-panel-hover text-xs font-body text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {([
            { id: 'rankings' as Tab, label: 'Rankings & Pujas', icon: LayoutDashboard },
            { id: 'pending' as Tab, label: 'Aprobaciones', icon: Inbox, badge: state.pendingBids.filter(p => p.status === 'pending').length },
            { id: 'claims' as Tab, label: 'Reclamos', icon: UserCheck, badge: state.businessClaims.filter(c => c.status === 'pending').length },
            { id: 'oficios' as Tab, label: 'Oficios', icon: Wrench, badge: state.pendingOficios.filter(p => p.status === 'pending').length },
            { id: 'categories' as Tab, label: 'Categorías', icon: Layers },
            { id: 'content' as Tab, label: 'Contenido', icon: Type },
            { id: 'season' as Tab, label: 'Temporada', icon: Calendar },
            { id: 'marquee' as Tab, label: 'Marquee', icon: Megaphone },
            { id: 'metrics' as Tab, label: 'Métricas', icon: Eye },
            { id: 'settings' as Tab, label: 'Configuración', icon: Settings },
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-body text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-neon-purple/15 border border-neon-purple/40 text-neon-purple'
                    : 'glass-panel text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.badge ? (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-white text-[10px] font-bold">{tab.badge}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'rankings' && <RankingsTab key="rankings" state={state} updateState={updateState} />}
          {activeTab === 'pending' && <PendingTab key="pending" state={state} updateState={updateState} />}
          {activeTab === 'claims' && <ClaimsTab key="claims" state={state} updateState={updateState} />}
          {activeTab === 'categories' && <CategoriesTab key="categories" state={state} updateState={updateState} />}
          {activeTab === 'content' && <ContentTab key="content" state={state} updateState={updateState} />}
          {activeTab === 'season' && <SeasonTab key="season" state={state} updateState={updateState} />}
          {activeTab === 'marquee' && <MarqueeTab key="marquee" state={state} updateState={updateState} />}
          {activeTab === 'metrics' && <MetricsTab key="metrics" state={state} updateState={updateState} />}
          {activeTab === 'oficios' && <OficiosTab key="oficios" state={state} updateState={updateState} />}
          {activeTab === 'settings' && <SettingsTab key="settings" state={state} updateState={updateState} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============ RANKINGS TAB ============ */

function RankingsTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [selCat, setSelCat] = useState<CategoryId>('gastronomia');
  const [selSub, setSelSub] = useState<string | null>(null);
  const [editing, setEditing] = useState<Business | null>(null);
  const [adding, setAdding] = useState(false);

  const currentCat = categories.find((c) => c.id === selCat);
  const ranked = state.businesses
    .filter((b) => b.category === selCat)
    .filter((b) => !selSub || b.subcategory === selSub)
    .sort((a, b) => b.bid - a.bid);

  const handleDelete = (id: string) => {
    updateState((prev) => ({ ...prev, businesses: prev.businesses.filter((b) => b.id !== id) }));
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    updateState((prev) => {
      const list = [...ranked];
      const idx = list.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= list.length) return prev;
      const a = list[idx];
      const b = list[swapIdx];
      const newBidA = b.bid + 500;
      const newBidB = a.bid;
      return {
        ...prev,
        businesses: prev.businesses.map((biz) => {
          if (biz.id === a.id) return { ...biz, bid: newBidA };
          if (biz.id === b.id) return { ...biz, bid: newBidB };
          return biz;
        }),
      };
    });
  };

  const handleSaveEdit = (updated: Business) => {
    updateState((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) => (b.id === updated.id ? updated : b)),
    }));
    setEditing(null);
  };

  const handleAddManual = (biz: Business) => {
    updateState((prev) => ({ ...prev, businesses: [...prev.businesses, biz] }));
    setAdding(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      {/* Category + Sub selectors */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => { setSelCat(cat.id); setSelSub(null); }} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${selCat === cat.id ? 'bg-neon-green/15 border border-neon-green/40 text-neon-green' : 'glass-panel text-muted-foreground'}`}>
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
        {currentCat && currentCat.subcategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setSelSub(null)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${selSub === null ? 'bg-neon-purple/15 border border-neon-purple/30 text-neon-purple' : 'glass-panel text-muted-foreground'}`}>Todos</button>
            {currentCat.subcategories.map((sub) => (
              <button key={sub.id} onClick={() => setSelSub(sub.id)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${selSub === sub.id ? 'bg-neon-purple/15 border border-neon-purple/30 text-neon-purple' : 'glass-panel text-muted-foreground'}`}>{sub.label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <button onClick={() => setAdding(true)} className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green font-display font-bold text-sm hover:bg-neon-green/20 transition-all">
        <Plus className="h-4 w-4" /> Agregar Comercio Manualmente
      </button>

      {/* Rankings list */}
      {ranked.length === 0 ? (
        <div className="glass-panel rounded-xl p-8 text-center text-sm text-muted-foreground font-body">No hay comercios en esta categoría.</div>
      ) : (
        <div className="space-y-2">
          {ranked.map((biz, idx) => (
            <div key={biz.id} className="glass-panel rounded-xl p-3 flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center">
                <span className={`font-display text-sm font-bold ${idx === 0 ? 'text-neon-gold' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>#{idx + 1}</span>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                <img src={biz.image} alt={biz.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm font-bold text-foreground truncate">{biz.name}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-neon-green font-body font-semibold">{formatARS(biz.bid)}</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20">
                    <Eye className="h-2.5 w-2.5 text-neon-purple" />
                    <span className="text-[10px] font-body text-neon-purple font-medium">{biz.clickCount} clics</span>
                  </div>
                  {(biz.status === 'hidden' || biz.status === 'suspended') && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-body">Oculto</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleMove(biz.id, 'up')} disabled={idx === 0} className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-green disabled:opacity-30 transition-all" title="Subir puesto">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => handleMove(biz.id, 'down')} disabled={idx === ranked.length - 1} className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-purple disabled:opacity-30 transition-all" title="Bajar puesto">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const nextStatus = biz.status === 'hidden' || biz.status === 'suspended' ? 'active' : 'hidden';
                    updateState((prev) => ({
                      ...prev,
                      businesses: prev.businesses.map((b) => (b.id === biz.id ? { ...b, status: nextStatus } : b)),
                    }));
                  }}
                  className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-gold transition-all"
                  title={biz.status === 'hidden' || biz.status === 'suspended' ? 'Mostrar comercio' : 'Ocultar comercio'}
                >
                  {biz.status === 'hidden' || biz.status === 'suspended' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing(biz)} className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-green transition-all" title="Editar">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(biz.id)} className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-destructive transition-all" title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && <EditBusinessModal business={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {/* Add modal */}
      {adding && <AddBusinessModal defaultCat={selCat} defaultSub={selSub} onAdd={handleAddManual} onClose={() => setAdding(false)} />}
    </motion.div>
  );
}

/* ============ EDIT BUSINESS MODAL ============ */

function EditBusinessModal({ business, onSave, onClose }: { business: Business; onSave: (b: Business) => void; onClose: () => void }) {
  const [form, setForm] = useState<Business>({
    ...business,
    clickCount: business.clickCount || 0,
    images: business.images || [],
    services: business.services || [],
    description: business.description || '',
    address: business.address || '',
    businessHours: business.businessHours || {},
  });
  const [servicesText, setServicesText] = useState((business.services || []).join(', '));
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const syncSocial = (patch: Partial<Business>): Business => ({
    ...form,
    ...patch,
    socialLinks: {
      whatsapp: patch.whatsapp ?? form.whatsapp,
      instagram: patch.instagram ?? form.instagram,
      googleMaps: patch.googleMaps ?? form.googleMaps ?? form.socialLinks?.googleMaps,
    },
  });

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if ((form.images?.length || 0) >= MAX_GALLERY_IMAGES) {
      alert(`Máximo ${MAX_GALLERY_IMAGES} fotos en la galería`);
      return;
    }
    setUploadingGallery(true);
    try {
      const base64 = await processImage(file);
      const images = [...(form.images || []), base64];
      setForm({
        ...form,
        images,
        image: form.image || base64,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al procesar la imagen');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleReplacePhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await processImage(file);
      const images = [...(form.images || [])];
      images[index] = base64;
      setForm({
        ...form,
        images,
        image: index === 0 ? base64 : form.image,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al reemplazar la imagen');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const images = (form.images || []).filter((_, i) => i !== index);
    setForm({
      ...form,
      images,
      image: form.image === form.images[index] ? (images[0] || '') : form.image,
    });
  };

  const persist = (): Business => ({
    ...form,
    services: servicesText.split(',').map((s) => s.trim()).filter(Boolean),
    socialLinks: {
      whatsapp: form.whatsapp,
      instagram: form.instagram,
      googleMaps: form.googleMaps || form.socialLinks?.googleMaps || '',
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Edit2 className="h-5 w-5 text-neon-green" /> Editar / Censurar Comercio</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <Field label="Nombre" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Slogan" value={form.slogan} onChange={(v) => setForm({ ...form, slogan: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50 resize-none"
            />
          </div>
          <Field label="Dirección" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field label="Titular / Contacto" value={form.owner} onChange={(v) => setForm({ ...form, owner: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Servicios (separados por coma)</label>
            <input
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Instagram" value={form.instagram} onChange={(v) => setForm(syncSocial({ instagram: v }))} />
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm(syncSocial({ whatsapp: v }))} />
          </div>
          <Field label="Google Maps URL" value={form.googleMaps || form.socialLinks?.googleMaps || ''} onChange={(v) => setForm(syncSocial({ googleMaps: v }))} />
          <Field label="Logo / Foto principal (URL o Base64)" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Galería ({form.images.length}/{MAX_GALLERY_IMAGES})</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-white/10" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                    <label className="p-1.5 rounded bg-neon-green/80 cursor-pointer" title="Reemplazar">
                      <Upload className="h-3.5 w-3.5 text-obsidian" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplacePhoto(idx, e)} />
                    </label>
                    <button type="button" onClick={() => handleRemovePhoto(idx)} className="p-1.5 rounded bg-destructive/80" title="Eliminar">
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {form.images.length < MAX_GALLERY_IMAGES && (
              <label className="flex items-center justify-center gap-2 cursor-pointer glass-panel rounded-lg p-3 border-2 border-dashed border-white/10 hover:border-neon-green/30 text-xs text-muted-foreground">
                <Upload className="h-4 w-4" />
                {uploadingGallery ? 'Procesando...' : 'Agregar foto (Base64)'}
                <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monto de Puja (ARS)" type="number" value={String(form.bid)} onChange={(v) => setForm({ ...form, bid: parseInt(v) || 0 })} />
            <Field label="Contador de Clics" type="number" value={String(form.clickCount)} onChange={(v) => setForm({ ...form, clickCount: parseInt(v) || 0 })} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave({ ...persist(), status: form.status === 'hidden' ? 'active' : 'hidden' })}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel border border-neon-gold/30 text-neon-gold font-display font-bold text-sm"
          >
            {form.status === 'hidden' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {form.status === 'hidden' ? 'Mostrar comercio' : 'Ocultar comercio'}
          </button>
        </div>
        <button onClick={() => onSave(persist())} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all">
          <Save className="h-4 w-4" /> Guardar cambios de texto y fotos
        </button>
      </motion.div>
    </div>
  );
}

/* ============ ADD BUSINESS MODAL ============ */

function AddBusinessModal({ defaultCat, defaultSub, onAdd, onClose }: { defaultCat: CategoryId; defaultSub: string | null; onAdd: (b: Business) => void; onClose: () => void }) {
  const [form, setForm] = useState<{
    name: string;
    category: CategoryId;
    subcategory: string;
    bid: string;
    whatsapp: string;
    instagram: string;
    image: string;
    slogan: string;
    clickCount: string;
  }>({
    name: '',
    category: defaultCat,
    subcategory: defaultSub || '',
    bid: String(MIN_BID),
    whatsapp: '',
    instagram: '',
    image: '',
    slogan: '',
    clickCount: '0',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const base64 = await processImage(file);
      setForm({ ...form, image: base64 });
      setImagePreview(base64);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al procesar la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, image: '' });
    setImagePreview('');
  };

  const currentCat = categories.find((c) => c.id === form.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto scrollbar-hide space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Store className="h-5 w-5 text-neon-green" /> Agregar Comercio</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <Field label="Nombre" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Categoría</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CategoryId, subcategory: '' })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
              {categories.map((c) => <option key={c.id} value={c.id} className="bg-panel">{c.emoji} {c.label}</option>)}
            </select>
          </div>
          {currentCat && currentCat.subcategories.length > 0 && (
            <div>
              <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Subcategoría</label>
              <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
                <option value="" className="bg-panel">— Sin subcategoría —</option>
                {currentCat.subcategories.map((s) => <option key={s.id} value={s.id} className="bg-panel">{s.label}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
            <Field label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
          </div>
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Logo / Foto</label>
            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded-lg border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Field label="O subí una imagen:" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
                  <div className="glass-panel rounded-lg p-3 border-2 border-dashed border-white/10 hover:border-neon-green/30 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="admin-image-upload"
                    />
                    <label
                      htmlFor="admin-image-upload"
                      className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-body">
                        {uploadingImage ? 'Procesando...' : 'Subir imagen'}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Field label="Puja (ARS)" type="number" value={form.bid} onChange={(v) => setForm({ ...form, bid: v })} />
          <Field label="Contador de Clics" type="number" value={form.clickCount} onChange={(v) => setForm({ ...form, clickCount: v })} />
          <Field label="Slogan" value={form.slogan} onChange={(v) => setForm({ ...form, slogan: v })} />
        </div>
        <button
          onClick={() => {
            if (!form.name || !form.subcategory) return;
            onAdd({
              id: 'admin-' + Date.now(),
              name: form.name,
              category: form.category,
              subcategory: form.subcategory,
              bid: parseInt(form.bid) || MIN_BID,
              owner: 'Admin',
              clickCount: parseInt(form.clickCount) || 0,
              address: 'Villaguay, Entre Ríos',
              image: form.image || '',
              images: [],
              whatsapp: form.whatsapp.startsWith('http') ? form.whatsapp : `https://wa.me/${form.whatsapp.replace(/\D/g, '')}`,
              instagram: form.instagram.startsWith('http') ? form.instagram : `https://instagram.com/${form.instagram.replace('@', '')}`,
              googleMaps: '',
              slogan: form.slogan || 'Nuevo comercio',
              description: '',
              services: [],
              businessHours: {},
              socialLinks: {
                whatsapp: form.whatsapp.startsWith('http') ? form.whatsapp : `https://wa.me/${form.whatsapp.replace(/\D/g, '')}`,
                instagram: form.instagram.startsWith('http') ? form.instagram : `https://instagram.com/${form.instagram.replace('@', '')}`,
                googleMaps: '',
              },
              daysAtTop: 0,
              status: 'active' as BusinessStatus,
            });
          }}
          disabled={!form.name || !form.subcategory}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all disabled:opacity-40"
        >
          <Plus className="h-4 w-4" /> Agregar al Ranking
        </button>
      </motion.div>
    </div>
  );
}

/* ============ PENDING TAB ============ */

function PendingTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const pending = state.pendingBids.filter((p) => p.status === 'pending');

  const handleApprove = (bid: PendingBid) => {
    updateState((prev) => {
      const existing = prev.businesses.find((b) => b.id === bid.business.id);
      let businesses: Business[];
      if (existing) {
        businesses = prev.businesses.map((b) => (b.id === bid.business.id ? { ...b, bid: bid.business.bid } : b));
      } else {
        businesses = [...prev.businesses, bid.business];
      }
      const catLabel = categories.find((c) => c.id === bid.business.category)?.label || '';
      const newEvent: LiveEvent = {
        id: 'approve-' + Date.now(),
        message: `✅ ${bid.business.name} fue aprobado en ${catLabel} con ${formatARS(bid.business.bid)}`,
        timeAgo: 'hace instantes',
        category: bid.business.category,
      };
      return {
        ...prev,
        businesses,
        events: [newEvent, ...prev.events],
        pendingBids: prev.pendingBids.map((p) => (p.id === bid.id ? { ...p, status: 'approved' as const } : p)),
      };
    });
  };

  const handleReject = (bid: PendingBid) => {
    updateState((prev) => ({
      ...prev,
      businesses: prev.businesses.filter((b) => !(b.id === bid.business.id && bid.status === 'pending')),
      pendingBids: prev.pendingBids.map((p) => (p.id === bid.id ? { ...p, status: 'rejected' as const } : p)),
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-4 glass-panel rounded-xl p-3 flex items-center gap-2">
        <Inbox className="h-4 w-4 text-neon-purple" />
        <span className="text-xs font-body text-muted-foreground">{pending.length} solicitud{pending.length === 1 ? '' : 'es'} pendiente{pending.length === 1 ? '' : 's'} de aprobación</span>
      </div>
      {pending.length === 0 ? (
        <div className="glass-panel rounded-xl p-8 text-center text-sm text-muted-foreground font-body">No hay solicitudes pendientes. Cuando un usuario pujá desde el sitio, su solicitud aparece acá.</div>
      ) : (
        <div className="space-y-2">
          {pending.map((bid) => (
            <div key={bid.id} className="glass-panel rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                  <img src={bid.business.image} alt={bid.business.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-bold text-foreground">{bid.business.name}</div>
                  <div className="text-xs text-muted-foreground font-body">
                    {categories.find((c) => c.id === bid.business.category)?.emoji} {categories.find((c) => c.id === bid.business.category)?.label}
                    {bid.business.subcategory && ` · ${categories.find((c) => c.id === bid.business.category)?.subcategories.find((s) => s.id === bid.business.subcategory)?.label || ''}`}
                  </div>
                  <div className="text-sm text-neon-green font-body font-semibold mt-1">{formatARS(bid.business.bid)}</div>
                </div>
              </div>
              {bid.receiptImage && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Comprobante de puja</p>
                  <img src={bid.receiptImage} alt="Comprobante" className="w-full max-h-48 object-contain rounded-lg border border-white/10 bg-black/20" />
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleApprove(bid)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neon-green/15 border border-neon-green/30 text-neon-green hover:bg-neon-green/25 transition-all text-xs font-display font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Aprobar comprobante
                </button>
                <button onClick={() => handleReject(bid)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-all text-xs font-display font-bold">
                  <XCircle className="h-4 w-4" /> Rechazar comprobante
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ============ SEASON TAB ============ */

function SeasonTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    updateState((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) => ({ ...b, bid: MIN_BID, daysAtTop: 0, clickCount: b.clickCount || 0 })),
      events: [
        { id: 'reset-' + Date.now(), message: `🔄 ¡Ciclo mensual reiniciado! Todos los rankings vuelven a ${formatARS(MIN_BID)}. ¡Que comience la nueva competencia!`, timeAgo: 'hace instantes', category: 'gastronomia' },
        ...prev.events,
      ],
      currentMonth: getCurrentMonthLabel(),
    }));
    setConfirming(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-neon-purple" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Control de Temporada Mensual</h3>
            <p className="text-xs text-muted-foreground font-body">Mes actual: <span className="text-neon-purple font-semibold capitalize">{state.currentMonth}</span></p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Al reiniciar el ciclo, todos los contadores de pujas se reinician a <span className="text-neon-gold font-bold">{formatARS(MIN_BID)}</span> y los días reinando vuelven a cero. Esto da inicio a una nueva competencia mensual limpia.
          </p>
        </div>
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-purple-600 text-white font-display font-bold text-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all">
            <RefreshCw className="h-5 w-5" /> Reiniciar Ciclo Mensual
          </button>
        ) : (
          <div className="space-y-3">
            <div className="glass-panel rounded-xl p-4 border border-destructive/30 text-center">
              <p className="text-sm text-foreground font-body">¿Confirmás el reinicio? Esta acción reseteará todas las pujas a {formatARS(MIN_BID)}.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive text-white font-display font-bold text-sm hover:opacity-90 transition-all">
                <RefreshCw className="h-4 w-4" /> Sí, Reiniciar Ahora
              </button>
              <button onClick={() => setConfirming(false)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel text-muted-foreground hover:text-foreground font-body font-medium text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============ MARQUEE TAB ============ */

function MarqueeTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [newMessage, setNewMessage] = useState('');

  const handleAdd = () => {
    if (!newMessage.trim()) return;
    updateState((prev) => ({
      ...prev,
      events: [
        { id: 'manual-' + Date.now(), message: newMessage, timeAgo: 'hace instantes', category: 'gastronomia' },
        ...prev.events,
      ],
    }));
    setNewMessage('');
  };

  const handleDelete = (id: string) => {
    updateState((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-neon-green" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Editor de Marquee</h3>
            <p className="text-xs text-muted-foreground font-body">Agregá o eliminá mensajes del ticker superior</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ej: 🔥 ¡Inició la competencia del mes de Marzo!"
            className="flex-1 px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
          />
          <button onClick={handleAdd} disabled={!newMessage.trim()} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all disabled:opacity-40">
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {state.events.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground font-body py-4">No hay mensajes en el ticker.</div>
          ) : (
            state.events.map((ev) => (
              <div key={ev.id} className="glass-panel rounded-lg p-3 flex items-center gap-3">
                <span className="text-xs text-neon-green font-body flex-1 truncate">{ev.message}</span>
                <span className="text-[10px] text-muted-foreground/50 font-body flex-shrink-0">{ev.timeAgo}</span>
                <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-destructive transition-all flex-shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ============ METRICS TAB ============ */

function MetricsTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const totalClicks = state.businesses.reduce((sum, biz) => sum + (biz.clickCount || 0), 0);
  const avgClicks = state.businesses.length > 0 ? Math.round(totalClicks / state.businesses.length) : 0;
  const topClicked = [...state.businesses].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5);

  const handleResetAllClicks = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todos los contadores de clics a 0?')) {
      updateState((prev) => ({
        ...prev,
        businesses: prev.businesses.map((biz) => ({ ...biz, clickCount: 0 })),
      }));
    }
  };

  const handleResetVisits = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar el contador de visitas totales a 0?')) {
      updateState((prev) => ({ ...prev, totalVisits: 0 }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Total Visits */}
        <div className="glass-panel rounded-xl p-5 border border-neon-purple/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
              <Eye className="h-5 w-5 text-neon-purple" />
            </div>
            <span className="text-sm text-muted-foreground font-body uppercase tracking-wider">Visitas Totales</span>
          </div>
          <div className="font-display text-3xl font-bold text-neon-purple">{state.totalVisits.toLocaleString()}</div>
        </div>

        {/* Total Businesses */}
        <div className="glass-panel rounded-xl p-5 border border-neon-green/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
              <Store className="h-5 w-5 text-neon-green" />
            </div>
            <span className="text-sm text-muted-foreground font-body uppercase tracking-wider">Comercios Activos</span>
          </div>
          <div className="font-display text-3xl font-bold text-neon-green">{state.businesses.length}</div>
        </div>

        {/* Total Clicks */}
        <div className="glass-panel rounded-xl p-5 border border-neon-gold/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center">
              <Eye className="h-5 w-5 text-neon-gold" />
            </div>
            <span className="text-sm text-muted-foreground font-body uppercase tracking-wider">Clics Totales</span>
          </div>
          <div className="font-display text-3xl font-bold text-neon-gold">{totalClicks.toLocaleString()}</div>
        </div>

        {/* Avg Clicks */}
        <div className="glass-panel rounded-xl p-5 border border-neon-purple/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-neon-purple" />
            </div>
            <span className="text-sm text-muted-foreground font-body uppercase tracking-wider">Promedio Clics</span>
          </div>
          <div className="font-display text-3xl font-bold text-neon-purple">{avgClicks.toLocaleString()}</div>
        </div>
      </div>

      {/* Top Clicked Businesses */}
      <div className="glass-panel rounded-2xl p-5 mb-6 border border-white/5">
        <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-neon-gold" />
          Top 5 Comercios más Clickeados
        </h3>
        {topClicked.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground font-body py-4">No hay comercios registrados aún.</div>
        ) : (
          <div className="space-y-2">
            {topClicked.map((biz, idx) => (
              <div key={biz.id} className="flex items-center gap-3 p-3 rounded-lg glass-panel">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center">
                  <span className={`font-display text-sm font-bold ${idx === 0 ? 'text-neon-gold' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>#{idx + 1}</span>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                  <img src={biz.image} alt={biz.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-bold text-foreground truncate">{biz.name}</div>
                  <div className="text-xs text-muted-foreground font-body">{categories.find((c) => c.id === biz.category)?.label}</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-gold/15 border border-neon-gold/30">
                  <Eye className="h-3.5 w-3.5 text-neon-gold" />
                  <span className="text-xs font-body text-neon-gold font-semibold">{biz.clickCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Buttons */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5">
        <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-destructive" />
          Reiniciar Contadores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleResetAllClicks}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-all text-xs font-display font-bold"
          >
            <RefreshCw className="h-4 w-4" />
            Reiniciar Todos los Clics
          </button>
          <button
            onClick={handleResetVisits}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-all text-xs font-display font-bold"
          >
            <RefreshCw className="h-4 w-4" />
            Reiniciar Visitas Totales
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ SETTINGS TAB ============ */

function SettingsTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [discountInput, setDiscountInput] = useState(String(state.lastPositionDiscount));

  const handleUpdateDiscount = () => {
    const newDiscount = parseInt(discountInput) || 50;
    if (newDiscount < 10 || newDiscount > 90) {
      alert('El descuento debe estar entre 10% y 90%');
      return;
    }
    updateState((prev) => ({ ...prev, lastPositionDiscount: newDiscount }));
    updateLastPositionDiscount(newDiscount);
    alert('Descuento actualizado correctamente');
  };

  const handleResetToSeed = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todos los datos a la plantilla de Villaguay? Esta acción eliminará todos los cambios y pujas actuales.')) {
      resetToSeedData();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="space-y-6">
        {/* Discount Settings */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
              <Settings className="h-5 w-5 text-neon-green" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Configuración de Descuento</h3>
              <p className="text-xs text-muted-foreground font-body">Ajustar el porcentaje para el último puesto</p>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-body">Descuento actual</span>
              <span className="text-lg font-display font-bold text-neon-green">{state.lastPositionDiscount}%</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Los comercios que se sumen al último puesto pagarán el {state.lastPositionDiscount}% del valor más bajo de la categoría.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              min="10"
              max="90"
              className="flex-1 px-4 py-3 rounded-lg glass-panel text-sm font-display font-bold text-foreground focus:outline-none focus:border-neon-green/50 transition-colors"
              placeholder="Nuevo porcentaje (10-90)"
            />
            <button
              onClick={handleUpdateDiscount}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
            >
              <Save className="h-4 w-4" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel rounded-2xl p-5 border border-destructive/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/40 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Gestión de Datos</h3>
              <p className="text-xs text-muted-foreground font-body">Restablecer datos a la plantilla original</p>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 mb-4 border border-destructive/30">
            <p className="text-sm text-foreground font-body mb-2">
              Esta acción restaurará todos los comercios a los datos semilla de Villaguay y eliminará:
            </p>
            <ul className="text-xs text-muted-foreground font-body space-y-1 ml-4">
              <li>• Todas las pujas actuales</li>
              <li>• Comercios agregados manualmente</li>
              <li>• Cambios en datos de comercios</li>
              <li>• Eventos personalizados</li>
            </ul>
          </div>

          <button
            onClick={handleResetToSeed}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive text-white font-display font-bold text-sm hover:opacity-90 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Restablecer Datos a Plantilla de Villaguay
          </button>
        </div>

        {/* Info */}
        <div className="glass-panel rounded-xl p-4 border border-neon-purple/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
              <Eye className="h-4 w-4 text-neon-purple" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">
                <span className="text-neon-purple font-semibold">Información:</span> Los datos semilla contienen 25 comercios reales de Villaguay organizados por categorías. Esta función es útil para limpiar datos de prueba o reiniciar la aplicación a su estado inicial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ CLAIMS TAB ============ */

function ClaimsTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const pendingClaims = state.businessClaims.filter(c => c.status === 'pending');
  const reviewedClaims = state.businessClaims.filter(c => c.status !== 'pending');

  const handleApprove = (claimId: string) => {
    if (confirm('¿Aprobar este reclamo y asignar el comercio al dueño?')) {
      approveBusinessClaim(claimId);
      window.location.reload();
    }
  };

  const handleReject = (claimId: string) => {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      rejectBusinessClaim(claimId, reason);
      window.location.reload();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="space-y-6">
        {/* Pending Claims */}
        <div className="glass-panel rounded-2xl p-5 border border-neon-purple/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-neon-purple" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Solicitudes de Reclamo Pendientes</h3>
              <p className="text-xs text-muted-foreground font-body">Usuarios que quieren reclamar comercios</p>
            </div>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground font-body py-8">
              No hay solicitudes de reclamo pendientes
            </div>
          ) : (
            <div className="space-y-4">
              {pendingClaims.map((claim) => {
                const business = state.businesses.find(b => b.id === claim.businessId);
                return (
                  <div key={claim.id} className="glass-panel rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img src={business?.image || getCategoryPlaceholder(business?.category || 'gastronomia', business?.name || '')} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-display text-base font-bold text-foreground">{business?.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-[10px] font-body font-semibold">Pendiente</span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground font-body">
                          <p><span className="text-foreground font-semibold">Dueño:</span> {claim.ownerName}</p>
                          <p><span className="text-foreground font-semibold">Teléfono:</span> {claim.ownerPhone}</p>
                          <p><span className="text-foreground font-semibold">Instagram:</span> {claim.ownerInstagram}</p>
                          <p><span className="text-foreground font-semibold">Método:</span> {claim.verificationMethod}</p>
                        </div>
                        {claim.verificationUrl && (
                          <div className="mt-3">
                            <img src={claim.verificationUrl} alt="Verificación" className="max-w-xs h-32 object-cover rounded-lg border border-white/10" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(claim.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive font-display font-bold text-sm hover:bg-destructive/25 transition-all"
                      >
                        <XCircle className="h-4 w-4" /> Rechazar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviewed Claims */}
        {reviewedClaims.length > 0 && (
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <h3 className="font-display text-base font-bold text-foreground mb-4">Historial de Reclamos</h3>
            <div className="space-y-2">
              {reviewedClaims.map((claim) => {
                const business = state.businesses.find(b => b.id === claim.businessId);
                const isApproved = claim.status === 'approved';
                return (
                  <div key={claim.id} className="glass-panel rounded-lg p-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isApproved ? 'bg-neon-green/15 border border-neon-green/40' : 'bg-destructive/15 border border-destructive/40'}`}>
                      {isApproved ? <CheckCircle2 className="h-4 w-4 text-neon-green" /> : <XCircle className="h-4 w-4 text-destructive" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-bold text-foreground truncate">{business?.name}</div>
                      <div className="text-xs text-muted-foreground font-body">{claim.ownerName} - {isApproved ? 'Aprobado' : 'Rechazado'}</div>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 font-body">
                      {new Date(claim.reviewedAt || 0).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============ CATEGORIES TAB ============ */

function CategoriesTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '', color: '#A855F7' });

  const allCategories = [...categories, ...state.customCategories].sort((a, b) => {
    const orderA = 'order' in a ? a.order : 0;
    const orderB = 'order' in b ? b.order : 0;
    return orderA - orderB;
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.emoji) return;
    addCustomCategory({
      ...newCategory,
      order: state.customCategories.length,
      subcategories: [],
    });
    setNewCategory({ name: '', emoji: '', color: '#A855F7' });
    setAddingCategory(false);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    updateCustomCategory(editingCategory.id, editingCategory);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const hasBusinesses = state.businesses.some(b => b.category === categoryId);
    if (hasBusinesses) {
      alert('No se puede eliminar una categoría que tiene comercios asignados. Reasigna los comercios primero.');
      return;
    }
    if (confirm('¿Eliminar esta categoría?')) {
      deleteCustomCategory(categoryId);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="space-y-6">
        {/* Add Category Button */}
        <div className="glass-panel rounded-2xl p-5 border border-neon-green/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neon-green/15 border border-neon-green/40 flex items-center justify-center">
                <FolderPlus className="h-6 w-6 text-neon-green" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Gestión de Categorías</h3>
                <p className="text-xs text-muted-foreground font-body">Agregar, editar o eliminar categorías personalizadas</p>
              </div>
            </div>
            <button
              onClick={() => setAddingCategory(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
            >
              <Plus className="h-4 w-4" /> Nueva Categoría
            </button>
          </div>
        </div>

        {/* Add Category Form */}
        {addingCategory && (
          <div className="glass-panel rounded-2xl p-5 border border-neon-green/30">
            <h4 className="font-display text-base font-bold text-foreground mb-4">Agregar Nueva Categoría</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Nombre de categoría"
                className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
              />
              <input
                value={newCategory.emoji}
                onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                placeholder="Emoji (ej: 🍔)"
                className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
              />
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddCategory} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm">
                <Save className="h-4 w-4" /> Guardar
              </button>
              <button onClick={() => setAddingCategory(false)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-foreground font-display font-bold text-sm">
                <X className="h-4 w-4" /> Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <h4 className="font-display text-base font-bold text-foreground mb-4">Categorías ({allCategories.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCategories.map((cat) => {
              const isCustom = state.customCategories.some(c => c.id === cat.id);
              const businessCount = state.businesses.filter(b => b.category === cat.id).length;
              const catName = 'label' in cat ? cat.label : cat.name;
              const catEmoji = 'emoji' in cat ? cat.emoji : (cat as any).emoji;
              const catSubs = 'subcategories' in cat ? cat.subcategories : (cat as any).subcategories;
              return (
                <div key={cat.id} className="glass-panel rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: isCustom && 'color' in cat ? (cat as any).color + '20' : 'rgba(168, 85, 247, 0.2)' }}>
                      {catEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-bold text-foreground truncate">{catName}</div>
                      <div className="text-xs text-muted-foreground font-body">{businessCount} comercios</div>
                    </div>
                    {isCustom && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingCategory(cat as any)}
                          className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-green transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
                    {catSubs.map((sub: any) => sub.label || sub.name).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Category Form */}
        {editingCategory && (
          <div className="glass-panel rounded-2xl p-5 border border-neon-green/30">
            <h4 className="font-display text-base font-bold text-foreground mb-4">Editar Categoría</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="Nombre de categoría"
                className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
              />
              <input
                value={editingCategory.emoji}
                onChange={(e) => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                placeholder="Emoji (ej: 🍔)"
                className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 transition-colors"
              />
              <input
                type="color"
                value={editingCategory.color}
                onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleUpdateCategory} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm">
                <Save className="h-4 w-4" /> Guardar Cambios
              </button>
              <button onClick={() => setEditingCategory(null)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-foreground font-display font-bold text-sm">
                <X className="h-4 w-4" /> Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============ CONTENT TAB ============ */

function ContentTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [editing, setEditing] = useState(false);
  const [texts, setTexts] = useState(state.globalTexts);

  const handleSave = () => {
    updateGlobalTexts(texts);
    setEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-5 border border-neon-purple/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
                <Type className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Personalización de Contenido</h3>
                <p className="text-xs text-muted-foreground font-body">Edita los textos globales del sitio</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-purple text-white font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
            >
              {editing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {editing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Título del Sitio</label>
              {editing ? (
                <input
                  value={texts.siteTitle}
                  onChange={(e) => setTexts({ ...texts, siteTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-lg glass-panel text-sm font-display font-bold text-foreground">{texts.siteTitle}</div>
              )}
            </div>

            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Subtítulo del Sitio</label>
              {editing ? (
                <input
                  value={texts.siteSubtitle}
                  onChange={(e) => setTexts({ ...texts, siteSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground">{texts.siteSubtitle}</div>
              )}
            </div>

            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Mensaje de Bienvenida</label>
              {editing ? (
                <textarea
                  value={texts.welcomeMessage}
                  onChange={(e) => setTexts({ ...texts, welcomeMessage: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors resize-none"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground">{texts.welcomeMessage}</div>
              )}
            </div>

            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Título del Hero</label>
              {editing ? (
                <input
                  value={texts.heroTitle}
                  onChange={(e) => setTexts({ ...texts, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-lg glass-panel text-sm font-display font-bold text-foreground">{texts.heroTitle}</div>
              )}
            </div>

            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Subtítulo del Hero</label>
              {editing ? (
                <textarea
                  value={texts.heroSubtitle}
                  onChange={(e) => setTexts({ ...texts, heroSubtitle: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/50 transition-colors resize-none"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground">{texts.heroSubtitle}</div>
              )}
            </div>

            {editing && (
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
              >
                <Save className="h-4 w-4" /> Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ OFICIOS TAB ============ */

function OficiosTab({ state, updateState }: { state: AppState; updateState: (u: (prev: AppState) => AppState) => void }) {
  const [editing, setEditing] = useState<Oficio | null>(null);
  const [adding, setAdding] = useState(false);
  const [section, setSection] = useState<'list' | 'pending'>('list');

  const pendingCount = state.pendingOficios.filter((p) => p.status === 'pending').length;

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este trabajador del directorio?')) return;
    deleteOficio(id);
  };

  const handleToggleAvailable = (id: string, current: boolean) => {
    updateOficio(id, { available: !current });
  };

  const handleApprovePending = (pendingId: string) => {
    approvePendingOficio(pendingId);
  };

  const handleRejectPending = (pendingId: string) => {
    if (!confirm('¿Rechazar esta solicitud?')) return;
    rejectPendingOficio(pendingId);
  };

  const handleSaveEdit = (updated: Oficio) => {
    updateOficio(updated.id, updated);
    setEditing(null);
  };

  const handleAdd = (oficio: Omit<Oficio, 'id'>) => {
    addOficio(oficio);
    setAdding(false);
  };

  const sortedOficios = [...state.oficios].sort((a, b) => b.rating - a.rating);
  const pendingList = state.pendingOficios.filter((p) => p.status === 'pending');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="space-y-4">
        {/* Sub-tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setSection('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-body font-medium transition-all ${section === 'list' ? 'bg-neon-green/15 border border-neon-green/40 text-neon-green' : 'glass-panel text-muted-foreground hover:text-foreground'}`}
          >
            <Wrench className="h-4 w-4" />
            Directorio ({state.oficios.length})
          </button>
          <button
            onClick={() => setSection('pending')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-body font-medium transition-all ${section === 'pending' ? 'bg-neon-gold/15 border border-neon-gold/40 text-neon-gold' : 'glass-panel text-muted-foreground hover:text-foreground'}`}
          >
            <Inbox className="h-4 w-4" />
            Solicitudes ({pendingCount})
          </button>
        </div>

        {section === 'list' ? (
          <>
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green font-display font-bold text-sm hover:bg-neon-green/20 transition-all"
            >
              <Plus className="h-4 w-4" /> Agregar Trabajador Manualmente
            </button>

            {sortedOficios.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-sm text-muted-foreground font-body">
                No hay trabajadores en el directorio todavía.
              </div>
            ) : (
              <div className="space-y-2">
                {sortedOficios.map((oficio, idx) => (
                  <div key={oficio.id} className="glass-panel rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center">
                      <span className={`font-display text-sm font-bold ${idx === 0 ? 'text-neon-gold' : 'text-muted-foreground'}`}>#{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-bold text-foreground truncate">{oficio.name}</div>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="text-xs text-neon-green font-body font-semibold">{oficio.trade}</span>
                        <span className="text-[10px] text-muted-foreground font-body">· {oficio.zone}</span>
                        <span className="text-[10px] text-neon-gold font-body">{oficio.medal}</span>
                        <span className="text-[10px] text-muted-foreground font-body">· {oficio.rating.toFixed(1)}★</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-body ${oficio.available ? 'bg-neon-green/15 text-neon-green' : 'bg-destructive/15 text-destructive'}`}>
                          {oficio.available ? 'Disponible' : 'Ocupado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleToggleAvailable(oficio.id, oficio.available)}
                        className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-gold transition-all"
                        title={oficio.available ? 'Marcar como ocupado' : 'Marcar como disponible'}
                      >
                        {oficio.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditing(oficio)}
                        className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-neon-green transition-all"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(oficio.id)}
                        className="p-2 rounded-lg glass-panel-hover text-muted-foreground hover:text-destructive transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {editing && <EditOficioModal oficio={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
            {adding && <AddOficioModal onAdd={handleAdd} onClose={() => setAdding(false)} />}
          </>
        ) : (
          <>
            {pendingList.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-sm text-muted-foreground font-body">
                No hay solicitudes pendientes. Cuando alguien envía el formulario &quot;Publicar mi Oficio&quot;, aparece acá para que lo apruebes.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingList.map((pending) => (
                  <div key={pending.id} className="glass-panel rounded-xl p-4 space-y-3 border border-neon-gold/20">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-gold/15 border border-neon-gold/40 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-neon-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm font-bold text-foreground">{pending.name}</div>
                        <div className="text-xs text-muted-foreground font-body mt-0.5">
                          {pending.trade} · {pending.zone}
                        </div>
                        {pending.bio && (
                          <p className="text-xs text-muted-foreground/70 font-body mt-1">{pending.bio}</p>
                        )}
                        <div className="text-xs text-neon-green font-body mt-1">{pending.whatsapp}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePending(pending.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neon-green/15 border border-neon-green/30 text-neon-green hover:bg-neon-green/25 transition-all text-xs font-display font-bold"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Aprobar y publicar
                      </button>
                      <button
                        onClick={() => handleRejectPending(pending.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-all text-xs font-display font-bold"
                      >
                        <XCircle className="h-4 w-4" /> Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ============ EDIT OFICIO MODAL ============ */

function EditOficioModal({ oficio, onSave, onClose }: { oficio: Oficio; onSave: (o: Oficio) => void; onClose: () => void }) {
  const [form, setForm] = useState<Oficio>({ ...oficio });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Edit2 className="h-5 w-5 text-neon-green" /> Editar Trabajador</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <Field label="Nombre / Apodo" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Oficio</label>
            <select value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
              {OFICIO_TRADES.map((t) => <option key={t} value={t} className="bg-panel">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Zona / Barrio</label>
            <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
              {VILLAGUAY_ZONES.map((z) => <option key={z} value={z} className="bg-panel">{z}</option>)}
            </select>
          </div>
          <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Descripción</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Medalla</label>
              <select value={form.medal} onChange={(e) => setForm({ ...form, medal: e.target.value as Medal })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
                <option value="oro" className="bg-panel">Oro</option>
                <option value="plata" className="bg-panel">Plata</option>
                <option value="bronce" className="bg-panel">Bronce</option>
                <option value="recomendado" className="bg-panel">Recomendado</option>
                <option value="nuevo" className="bg-panel">Nuevo</option>
              </select>
            </div>
            <Field label="Calificación (0-5)" type="number" value={String(form.rating)} onChange={(v) => setForm({ ...form, rating: parseFloat(v) || 0 })} />
          </div>
          <Field label="Cantidad de reseñas" type="number" value={String(form.reviews)} onChange={(v) => setForm({ ...form, reviews: parseInt(v) || 0 })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 rounded accent-neon-green" />
            <span className="text-sm font-body text-foreground">Disponible para trabajar</span>
          </label>
        </div>
        <button onClick={() => onSave(form)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all">
          <Save className="h-4 w-4" /> Guardar cambios
        </button>
      </motion.div>
    </div>
  );
}

/* ============ ADD OFICIO MODAL ============ */

function AddOficioModal({ onAdd, onClose }: { onAdd: (o: Omit<Oficio, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    trade: OFICIO_TRADES[0],
    zone: VILLAGUAY_ZONES[0],
    whatsapp: '',
    bio: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto scrollbar-hide space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Wrench className="h-5 w-5 text-neon-green" /> Agregar Trabajador</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <Field label="Nombre / Apodo" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Oficio</label>
            <select value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
              {OFICIO_TRADES.map((t) => <option key={t} value={t} className="bg-panel">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Zona / Barrio</label>
            <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50">
              {VILLAGUAY_ZONES.map((z) => <option key={z} value={z} className="bg-panel">{z}</option>)}
            </select>
          </div>
          <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
          <div>
            <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Descripción</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Breve descripción del trabajo que realiza" className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-green/50 resize-none" />
          </div>
        </div>
        <button
          onClick={() => {
            if (!form.name) return;
            onAdd({
              name: form.name,
              trade: form.trade,
              zone: form.zone,
              whatsapp: form.whatsapp.startsWith('http') ? form.whatsapp : `https://wa.me/${form.whatsapp.replace(/\D/g, '')}`,
              bio: form.bio,
              rating: 5.0,
              reviews: 0,
              medal: 'nuevo',
              available: true,
            });
          }}
          disabled={!form.name}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green text-obsidian font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all disabled:opacity-40"
        >
          <Plus className="h-4 w-4" /> Agregar al Directorio
        </button>
      </motion.div>
    </div>
  );
}

/* ============ SHARED FIELD COMPONENT ============ */

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-lg glass-panel text-sm font-body text-foreground focus:outline-none focus:border-neon-green/50 transition-colors" />
    </div>
  );
}
