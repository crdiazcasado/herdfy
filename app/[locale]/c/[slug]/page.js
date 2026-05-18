import ParticipationForm from '@/app/components/ParticipationForm'
import ShareButton from '@/app/components/ShareButton'
import CampaignDetailClient from '@/app/components/CampaignDetailClient'
import ReportButton from '@/app/components/ReportButton'
import ScrollHint from '@/app/components/ScrollHint'
import CampaignCreatorAlert from '@/app/components/CampaignCreatorAlert'
import { supabaseServer as supabase } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

export const revalidate = 180

async function getCampaign(slug) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
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
      url, type: 'website',
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
  const { locale, slug } = resolvedParams
  const campaign = await getCampaign(slug)
  if (!campaign) notFound()

  const t = await getTranslations({ locale, namespace: 'campaign' })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ca' ? 'ca-ES' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const today = new Date().toISOString().split('T')[0]
  const isExpired = campaign.status !== 'active' || (campaign.deadline && campaign.deadline < today)
  const count = campaign.participation_count || 0

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f7f4' }}>
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>

            {/* ── COLUMNA IZQUIERDA 1/3 ── */}
            <div className="campaign-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={campaign.image_url || '/hero.webp'} alt={campaign.title}
                  style={{ width: '100%', height: '208px', objectFit: 'cover', display: 'block' }}
                  loading="eager" width={600} height={208} />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1c2b22', lineHeight: 1.3, margin: 0 }}>
                    {campaign.title}
                  </h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#4d5e56' }}>
                    <span>📅 {t('deadline', { date: formatDate(campaign.deadline) })}</span>
                    {campaign.participation_count > 0 && (
                      <span>⚡ <strong style={{ color: '#1c2b22' }}>{campaign.participation_count}</strong> {t('participationsLabel', { count: campaign.participation_count })}</span>
                    )}
                  </div>
                  <div style={{ borderTop: '1px solid #e4e1da', paddingTop: '16px' }}>
                    <CampaignDetailClient
                      recipients={
                        campaign.recipients?.length > 0
                          ? campaign.recipients
                          : [{ name: campaign.recipient_name, email: campaign.recipient_email }]
                      }
                      campaign={campaign}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── COLUMNA DERECHA 2/3 ── */}
            <div className="campaign-main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <CampaignCreatorAlert campaign={campaign} />

              {isExpired && (
                <div style={{ background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0, lineHeight: 1 }}>🎉</div>
                  <div>
                    <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#1c2b22', marginBottom: '6px', lineHeight: 1.3 }}>
                      {count > 0
                        ? t('expiredWithCount', { count })
                        : t('expiredNoCount')}
                    </p>
                    <p style={{ fontSize: '14px', color: '#4d5e56', lineHeight: 1.6, margin: 0 }}>
                      {t('expiredDescription')}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #3a9e7a' }}>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#1c2b22', marginBottom: '12px' }}>
                  {t('whyImportant')}
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
                      {t('sharePrompt')}
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
    </div>
  )
}
