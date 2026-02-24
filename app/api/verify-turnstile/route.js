import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token missing' }, { status: 400 })
    }

    const formData = new FormData()
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY)
    formData.append('response', token)

    const result = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: formData }
    )

    const data = await result.json()

    return NextResponse.json({ success: data.success })

  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}
