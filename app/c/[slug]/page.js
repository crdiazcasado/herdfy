import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ParticipationForm from '../../components/ParticipationForm'
import ShareButton from '../../components/ShareButton'
import CampaignDetailClient from '../../components/CampaignDetailClient'
import ReportButton from '../../components/ReportButton'
import ScrollHint from '../../components/ScrollHint'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 180

const AVATAR_COLORS = {
  violet: '#7c3aed', blue: '#2563eb', green: '#16a34a',
  yellow: '#ca8a04', orange: '#ea580c', pink: '#db2777',
  teal: '#0d9488', red: '#dc2626',
}
const AVATAR_BG = {
  violet: '#ede9fe', blue: '#dbeafe', green: '#dcfce7',
  yellow: '#fef9c3', orange: '#ffedd5', pink: '#fce7f3',
  teal: '#ccfbf1', red: '#fee2e2',
}

async function getCampaign(slug) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`*, users (name, email, avatar_color)`)
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.slug)
  if (!campaign) return {}

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/c/${campaign.slug}`
  const image = campaign.image_url || `${process.env.NEXT_PUBLIC_SITE_URL}/og-default.png`

  return {
    title: campaign.title,
    description: campaign.description?.slice(0, 160),
    openGraph: {
      title: campaign.title,
      description: campaign.description?.slice(0, 160),
      url,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: campaign.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description: campaign.description?.slice(0, 160),
      images: [image],
    },
  }
}

export default async function CampaignDetail({ params }) {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.slug)
  if (!campaign) notFound()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getCreatorName = () => {
    if (campaign.users?.name) return campaign.users.name
    if (campaign.users?.email) return campaign.users.email.split('@')[0]
    return 'Anónimo'
  }

  const avatarColor = campaign.users?.avatar_color || 'violet'
  const avatarBg = AVATAR_BG[avatarColor] || AVATAR_BG.violet
  const avatarText = AVATAR_COLORS[avatarColor] || AVATAR_COLORS.violet

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f7f4' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 24px' }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>

            {/* ── COLUMNA IZQUIERDA 1/3 ── */}
            <div style={{ flex: '1 1 280px', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>

              <div style={{ background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', overflow: 'hidden' }}>

                <img
                  src={campaign.image_url || '/sheep-hero.jpg'}
                  alt={campaign.title}
                  style={{ width: '100%', height: '208px', objectFit: 'cover', display: 'block' }}
                  loading="eager"
                  width={600}
                  height={208}
                />

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1c2b22', lineHeight: 1.3, margin: 0 }}>
                    {campaign.title}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', background: avatarBg, color: avatarText, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                      {getCreatorName()[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: '13px', color: '#94a3a0' }}>
                      Por <span style={{ fontWeight: 600, color: '#4d5e56' }}>{getCreatorName()}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#4d5e56' }}>
                    <span>📅 Hasta el {formatDate(campaign.deadline)}</span>
                    {campaign.participation_count > 0 && (
                      <span>⚡ <strong style={{ color: '#1c2b22' }}>{campaign.participation_count}</strong> participaciones</span>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #e4e1da', paddingTop: '16px' }}>
                    <CampaignDetailClient
                      recipientName={campaign.recipient_name}
                      recipientEmail={campaign.recipient_email}
                      campaign={campaign}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* ── COLUMNA DERECHA 2/3 ── */}
            <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #3a9e7a' }}>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#1c2b22', marginBottom: '12px' }}>
                  ¿Por qué es importante?
                </h2>
                <p style={{ fontSize: '14px', color: '#4d5e56', whiteSpace: 'pre-line', lineHeight: 1.7, margin: 0 }}>
                  {campaign.description}
                </p>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e4e1da', overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <ParticipationForm campaign={campaign} />
                </div>

                <div style={{ padding: '0 24px 16px' }}>
                  <div style={{ borderTop: '1px solid #e4e1da', paddingTop: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#94a3a0', marginBottom: '10px', fontWeight: 500 }}>
                      📣 ¿Conoces a alguien que también debería participar? ¡Comparte!
                    </p>
                    <ShareButton campaign={campaign} />
                  </div>
                </div>

                <div style={{ padding: '0 24px 24px' }}>
                  <ReportButton campaign={campaign} />
                </div>
              </div>

            </div>
          </div>

        </div>
        <ScrollHint />
      </main>

      <Footer />
    </div>
  )
}