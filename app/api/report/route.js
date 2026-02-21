import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { campaignTitle, campaignSlug, reason, details } = await request.json()

    await resend.emails.send({
      from: 'herdfy@herdfy.com', 
      to: 'neskadica@gmail.com',
      subject: `[Herdfy] Denuncia: ${campaignTitle}`,
      html: `
        <h2>Nueva denuncia recibida</h2>
        <p><strong>Campaña:</strong> ${campaignTitle}</p>
        <p><strong>URL:</strong> https://www.herdfy.com/c/${campaignSlug}</p>
        <hr />
        <p><strong>Motivo:</strong> ${reason}</p>
        <p><strong>Detalles:</strong> ${details || 'No se han añadido detalles.'}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending report email:', error)
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 })
  }
}
