import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Registrar punto de referido
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { ref_key, visitor_hash } = body;

    if (!ref_key || !visitor_hash) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Buscar el publicista por ref_key
    const { data: publicista, error: publicistaError } = await supabase
      .from('publicistas')
      .select('id, puntos_mes_actual')
      .eq('ref_key', ref_key)
      .single();

    if (publicistaError || !publicista) {
      return NextResponse.json(
        { error: 'Publicista no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya existe un registro para este visitante y publicista en las últimas 24 horas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: existingLog, error: logError } = await supabase
      .from('referral_logs')
      .select('id')
      .eq('publicista_id', publicista.id)
      .eq('visitor_hash', visitor_hash)
      .gte('created_at', twentyFourHoursAgo)
      .maybeSingle();

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 400 });
    }

    if (existingLog) {
      return NextResponse.json(
        { message: 'Visitante ya registrado en las últimas 24 horas' },
        { status: 200 }
      );
    }

    // Registrar el log de referido
    const { error: insertLogError } = await supabase
      .from('referral_logs')
      .insert({
        publicista_id: publicista.id,
        visitor_hash,
      });

    if (insertLogError) {
      return NextResponse.json({ error: insertLogError.message }, { status: 400 });
    }

    // Incrementar puntos del publicista
    const { error: updateError } = await supabase
      .from('publicistas')
      .update({ puntos_mes_actual: publicista.puntos_mes_actual + 1 })
      .eq('id', publicista.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Punto registrado exitosamente',
      puntos_nuevos: 1
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}