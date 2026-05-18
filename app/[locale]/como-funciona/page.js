import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'howItWorks' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

const sectionTitle = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontSize: '22px',
  fontWeight: 700,
  color: '#1c2b22',
  marginBottom: '20px',
}

const stepNumber = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: '#eaf5f0',
  color: '#3a9e7a',
  fontWeight: 700,
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const stepTitle = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#1c2b22',
  marginBottom: '4px',
}

const stepDesc = {
  fontSize: '15px',
  color: '#4d5e56',
  lineHeight: 1.6,
  margin: 0,
}

function Step({ n, title, description }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={stepNumber}>{n}</div>
      <div>
        <p style={stepTitle}>{title}</p>
        <p style={stepDesc}>{description}</p>
      </div>
    </div>
  )
}

export default async function ComoFunciona({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'howItWorks' })

  return (
    <main style={{ background: '#f8f7f4', minHeight: '100vh', padding: '48px 16px 80px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: '#1c2b22', lineHeight: 1.2, marginBottom: '16px' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '17px', color: '#4d5e56', lineHeight: 1.65 }}>
            {t('subtitle')}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e1da', padding: '28px', marginBottom: '16px' }}>
          <h2 style={sectionTitle}>{t('participateTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Step n={1} title={t('p1Title')} description={t('p1Desc')} />
            <Step n={2} title={t('p2Title')} description={t('p2Desc')} />
            <Step n={3} title={t('p3Title')} description={t('p3Desc')} />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e1da', padding: '28px', marginBottom: '16px' }}>
          <h2 style={sectionTitle}>{t('createTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Step n={1} title={t('c1Title')} description={t('c1Desc')} />
            <Step n={2} title={t('c2Title')} description={t('c2Desc')} />
            <Step n={3} title={t('c3Title')} description={t('c3Desc')} />
          </div>
        </div>

        <div style={{ background: '#eaf5f0', borderRadius: '16px', border: '1px solid #c6e8da', padding: '24px' }}>
          <h2 style={{ ...sectionTitle, marginBottom: '10px', fontSize: '17px' }}>{t('dataTitle')}</h2>
          <p style={{ fontSize: '15px', color: '#4d5e56', lineHeight: 1.65, margin: 0 }}>
            {t('dataDesc')}
          </p>
        </div>

      </div>
    </main>
  )
}
