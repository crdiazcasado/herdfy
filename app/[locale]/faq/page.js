'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid #e4e1da' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '16px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#1c2b22', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: '24px', height: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', background: open ? '#3a9e7a' : '#f0f0ee',
          color: open ? 'white' : '#4d5e56',
          fontSize: '16px', fontWeight: 400,
          transition: 'background 0.2s, color 0.2s',
        }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p style={{ fontSize: '15px', color: '#4d5e56', lineHeight: 1.65, margin: '0 0 20px', paddingRight: '40px' }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  const t = useTranslations('faq')

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
    { q: t('q7'), a: t('a7') },
  ]

  return (
    <main style={{ background: '#f8f7f4', minHeight: '100vh', padding: '48px 16px 80px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: '#1c2b22', lineHeight: 1.2, marginBottom: '12px' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '17px', color: '#4d5e56', lineHeight: 1.65 }}>
            {t('subtitle')}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e1da', padding: '0 24px' }}>
          {faqs.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

      </div>
    </main>
  )
}
