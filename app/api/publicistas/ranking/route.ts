import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Obtener ranking de publicistas
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Obtener ranking de publicistas
    const { data: publicistas, error } = await supabase
      .from('publicistas')
      .select('*')
      .order('puntos_mes_actual', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Obtener competencia activa
    const { data: competencia, error: compError } = await supabase
      .from('competencias_mensuales')
      .select('*')
      .eq('esta_activo', true)
      .single();

    if (compError) {
      // Si no hay competencia activa, usar valores por defecto
      return NextResponse.json({
        ranking: publicistas || [],
        competencia: {
          titulo: 'Torneo Mensual de Publicistas',
          monto_premio: 100000,
          fecha_fin: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        },
      });
    }

    return NextResponse.json({
      ranking: publicistas || [],
      competencia,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}