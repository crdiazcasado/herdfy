import { supabase } from '../../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Primero leemos el valor actual
    const { data: current, error: fetchError } = await supabase
      .from('campaigns')
      .select('participation_count')
      .eq('slug', slug)
      .single()

    if (fetchError) {
      console.error('Error leyendo participation_count:', fetchError)
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const newCount = (current.participation_count || 0) + 1

    // Luego actualizamos con el nuevo valor
    const { data, error } = await supabase
      .from('campaigns')
      .update({ participation_count: newCount })
      .eq('slug', slug)
      .select()

    if (error) {
      console.error('Error actualizando participation_count:', error)
      return NextResponse.json({ error: 'Failed to update participation count' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      participation_count: data[0]?.participation_count
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}