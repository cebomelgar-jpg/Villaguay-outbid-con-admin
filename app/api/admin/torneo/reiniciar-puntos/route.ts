import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Reiniciar todos los puntos a 0
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from('publicistas')
      .update({ puntos_mes_actual: 0 })
      .neq('puntos_mes_actual', 0);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Puntos reiniciados exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}