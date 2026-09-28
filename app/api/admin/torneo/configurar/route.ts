import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Configurar competencia mensual
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { titulo, monto_premio, fecha_inicio, fecha_fin, esta_activo } = body;

    if (!titulo || !monto_premio || !fecha_inicio || !fecha_fin) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Buscar competencia activa actual
    const { data: existingActive } = await supabase
      .from('competencias_mensuales')
      .select('id')
      .eq('esta_activo', true)
      .single();

    // Si hay una activa y estamos activando una nueva, desactivar la anterior
    if (existingActive && esta_activo) {
      await supabase
        .from('competencias_mensuales')
        .update({ esta_activo: false })
        .eq('id', existingActive.id);
    }

    // Crear o actualizar competencia
    const { data, error } = await supabase
      .from('competencias_mensuales')
      .upsert({
        titulo,
        monto_premio,
        fecha_inicio: new Date(fecha_inicio).toISOString(),
        fecha_fin: new Date(fecha_fin).toISOString(),
        esta_activo,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ competencia: data });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}