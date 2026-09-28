import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Database types
export interface Publicista {
  id: string;
  nombre_usuario: string;
  nombre_publico: string;
  ref_key: string;
  whatsapp_contacto: string;
  created_at: string;
  puntos_mes_actual: number;
}

export interface ReferralLog {
  id: string;
  publicista_id: string;
  visitor_hash: string;
  created_at: string;
}

export interface CompetenciaMensual {
  id: string;
  titulo: string;
  monto_premio: number;
  fecha_inicio: string;
  fecha_fin: string;
  esta_activo: boolean;
}