import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH - Actualizar publicista
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { nombre_usuario, nombre_publico, whatsapp_contacto, puntos_mes_actual } = body;

    const { data, error } = await supabase
      .from('publicistas')
      .update({
        nombre_usuario,
        nombre_publico,
        whatsapp_contacto,
        puntos_mes_actual,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ publicista: data });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar publicista
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from('publicistas')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Publicista eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}