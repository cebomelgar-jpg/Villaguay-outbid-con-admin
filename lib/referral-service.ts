import { supabase } from './supabase';

export async function registerReferralPoint(refKey: string, visitorHash: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase no está configurado, omitiendo registro de referido');
    return false;
  }

  try {
    const response = await fetch('/api/referidos/registrar-punto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref_key: refKey,
        visitor_hash: visitorHash,
      }),
    });

    if (!response.ok) {
      console.error('Error registrando punto de referido:', await response.text());
      return false;
    }

    const data = await response.json();
    console.log('Punto registrado:', data);
    return true;
  } catch (error) {
    console.error('Error en registro de referido:', error);
    return false;
  }
}

export async function getPublicistaByRefKey(refKey: string) {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('publicistas')
      .select('*')
      .eq('ref_key', refKey)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getPublicistaRanking() {
  try {
    const response = await fetch('/api/publicistas/ranking');
    if (!response.ok) return null;
    
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}