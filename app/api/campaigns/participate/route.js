import { supabase } from '../../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { slug } = await request.json()
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Incrementar contador de participaciones
    const { data, error } = await supabase
      .from('campaigns')
      .update({ 
        participation_count: supabase.raw('participation_count + 1')
      })
      .eq('slug', slug)
      .select()

    if (error) {
      console.error('Error updating participation count:', error)
      return NextResponse.json(
        { error: 'Failed to update participation count' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      participation_count: data[0]?.participation_count 
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
