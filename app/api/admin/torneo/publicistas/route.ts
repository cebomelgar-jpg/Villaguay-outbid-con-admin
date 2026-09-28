import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Crear nuevo publicista (admin)
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { nombre_usuario, nombre_publico, whatsapp_contacto, puntos_mes_actual } = body;

    if (!nombre_usuario || !nombre_publico || !whatsapp_contacto) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Generar ref_key único
    const ref_key = nombre_usuario
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('publicistas')
      .select('id')
      .eq('ref_key', ref_key)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Este nombre de usuario ya está en uso' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('publicistas')
      .insert({
        nombre_usuario,
        nombre_publico,
        ref_key,
        whatsapp_contacto,
        puntos_mes_actual: puntos_mes_actual || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ publicista: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}