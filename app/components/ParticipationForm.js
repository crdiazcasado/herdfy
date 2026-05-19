'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Turnstile } from '@marsidev/react-turnstile'

function getUsedFields(template) {
  return {
    nombre:    /\(NOMBRE\)/.test(template),
    dni:       /\(DNI\)/.test(template),
    localidad: /\(LOCALIDAD\)/.test(template),
    fecha:     /\(FECHA\)/.test(template),
  }
}

function isCampaignExpired(campaign) {
  if (campaign.status !== 'active') return true
  if (!campaign.deadline) return false
  const today = new Date().toISOString().split('T')[0]
  return campaign.deadline < today
}

export default function ParticipationForm({ campaign }) {
  const t = useTranslations('form')
  const locale = useLocale()
  const expired = isCampaignExpired(campaign)
  const used = getUsedFields(campaign.email_template)

  const dateLocale = locale === 'ca' ? 'ca-ES' : 'es-ES'

  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    localidad: '',
    fecha: new Date().toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }),
    asunto: campaign.email_subject
  })
  const [message, setMessage] = useState(campaign.email_template)
  const recipients = campaign.recipients?.length > 0
    ? campaign.recipients
    : [{ name: campaign.recipient_name, email: campaign.recipient_email }]

  const [copied, setCopied] = useState(false)
  const [copiedRecipient, setCopiedRecipient] = useState(false)
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(false)
  const turnstileRef = useRef(null)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    if (used.fecha) {
      const today = new Date().toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
      setMessage(prev => prev.replace(/\(FECHA\)/g, today))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)
    updateMessage(updated)
  }

  const updateMessage = (data) => {
    let updated = campaign.email_template
    if (used.nombre    && data.nombre)    updated = updated.replace(/\(NOMBRE\)/g, data.nombre)
    if (used.dni       && data.dni)       updated = updated.replace(/\(DNI\)/g, data.dni)
    if (used.localidad && data.localidad) updated = updated.replace(/\(LOCALIDAD\)/g, data.localidad)
    if (used.fecha     && data.fecha)     updated = updated.replace(/\(FECHA\)/g, data.fecha)
    setMessage(updated)
  }

  const handleMessageChange = (e) => {
    if (campaign.allow_edit) setMessage(e.target.value)
  }

  const getFinalMessage = () => {
    let final = message
    if (used.nombre)    final = final.replace(/\(NOMBRE\)/g, formData.nombre)
    if (used.dni)       final = final.replace(/\(DNI\)/g, formData.dni)
    if (used.localidad) final = final.replace(/\(LOCALIDAD\)/g, formData.localidad)
    if (used.fecha)     final = final.replace(/\(FECHA\)/g, formData.fecha)
    return final
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        ok ? resolve() : reject()
      } catch (err) { document.body.removeChild(ta); reject(err) }
    })
  }

  const verifyTurnstile = async (token) => {
    try {
      const res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      return data.success
    } catch { return false }
  }

  const incrementParticipation = async () => {
    try {
      await fetch('/api/campaigns/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: campaign.slug }),
      })
    } catch (err) { console.error('Error incrementando participación:', err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCaptchaError(false)
    if (!turnstileToken) { setCaptchaError(true); return }
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) {
      setCaptchaError(true)
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      return
    }
    const subject = encodeURIComponent(formData.asunto)
    const body = encodeURIComponent(getFinalMessage())
    const allEmails = recipients.map(r => r.email).join(',')
    await incrementParticipation()
    window.location.href = `mailto:${allEmails}?subject=${subject}&body=${body}`
  }

  const handleCopyMessage = async (e) => {
    e.preventDefault()
    try {
      await copyToClipboard(getFinalMessage())
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch { console.log('Portapapeles no disponible') }
  }

  const handleCopyRecipient = async () => {
    try {
      const allEmails = recipients.map(r => r.email).join(', ')
      await copyToClipboard(allEmails)
      setCopiedRecipient(true)
      setTimeout(() => setCopiedRecipient(false), 3000)
    } catch { console.log('Portapapeles no disponible') }
  }

  const handleCopySubject = async () => {
    try {
      await copyToClipboard(formData.asunto)
      setCopiedSubject(true)
      setTimeout(() => setCopiedSubject(false), 3000)
    } catch { console.log('Portapapeles no disponible') }
  }

  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: 500,
    color: '#364153', marginBottom: '6px'
  }
  const inputStyle = {
    width: '100%', padding: '9px 13px',
    border: '1.5px solid #e4e1da', borderRadius: '8px',
    fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
    color: '#1c2b22', background: '#f8f7f4', outline: 'none',
    boxSizing: 'border-box'
  }

  if (expired) {
    return (
      <div>
        <label style={labelStyle}>{t('messageLabel')}</label>
        <textarea
          rows={8}
          value={campaign.email_template}
          readOnly
          className="mobile-textarea"
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.55, background: '#f0f0ee', color: '#94a3a0', cursor: 'default' }}
        />
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <div>
          <label style={labelStyle}>{t('subjectLabel')}</label>
          <input type="text" name="asunto" value={formData.asunto}
            onChange={(e) => setFormData(prev => ({ ...prev, asunto: e.target.value }))}
            style={inputStyle} />
        </div>

        {used.nombre && (
          <div>
            <label style={labelStyle}>{t('nameLabel')}</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
              style={inputStyle} placeholder={t('namePlaceholder')} />
          </div>
        )}

        {used.dni && (
          <div>
            <label style={labelStyle}>{t('dniLabel')}</label>
            <input type="text" name="dni" value={formData.dni} onChange={handleChange}
              style={inputStyle} placeholder="12345678A" />
          </div>
        )}

        {used.localidad && (
          <div>
            <label style={labelStyle}>{t('localidadLabel')}</label>
            <input type="text" name="localidad" value={formData.localidad} onChange={handleChange}
              style={inputStyle} placeholder={t('localidadPlaceholder')} />
          </div>
        )}

        {used.fecha && (
          <div>
            <label style={labelStyle}>{t('fechaLabel')}</label>
            <input type="text" name="fecha" value={formData.fecha}
              onChange={(e) => {
                const updated = { ...formData, fecha: e.target.value }
                setFormData(updated)
                updateMessage(updated)
              }}
              style={{ ...inputStyle, color: '#4d5e56' }} />
          </div>
        )}

        <div>
          <label style={labelStyle}>
            {campaign.allow_edit ? t('messageLabelEditable') : t('messageLabelReadonly')}
          </label>
          <textarea
            rows={8}
            value={message}
            onChange={handleMessageChange}
            readOnly={!campaign.allow_edit}
            className="mobile-textarea"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55, background: campaign.allow_edit ? '#f8f7f4' : '#f0f0ee' }}
          />
        </div>

        <div className="turnstile-wrapper">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={(token) => { setTurnstileToken(token); setCaptchaError(false) }}
            onError={() => { setTurnstileToken(null); setCaptchaError(true) }}
            onExpire={() => setTurnstileToken(null)}
            options={{ theme: 'light', language: 'auto', size: 'flexible' }}
            style={{ width: '100%' }}
          />
          {captchaError && (
            <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '4px' }}>
              {t('captchaError')}
            </p>
          )}
        </div>

        {/* Botones móvil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="md:hidden">
          {isMobile && (
            <button type="submit"
              style={{ width: '100%', padding: '12px', background: '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              {t('sendButton')}
            </button>
          )}
          <button type="button" onClick={handleCopyMessage}
            style={{ width: '100%', padding: '11px', background: 'transparent', color: '#3a9e7a', border: '1.5px solid #3a9e7a', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            {copied ? t('messageCopied') : t('copyMessage')}
          </button>
        </div>

        {/* Botones desktop */}
        <div style={{ display: 'none', gap: '10px' }} className="hidden md:flex">
          <button type="button" onClick={handleCopyRecipient}
            style={{ flex: 1, padding: '10px', border: '1.5px solid #e4e1da', color: '#4d5e56', borderRadius: '100px', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', cursor: 'pointer' }}>
            {copiedRecipient ? t('copied') : t('copyRecipient')}
          </button>
          <button type="button" onClick={handleCopySubject}
            style={{ flex: 1, padding: '10px', border: '1.5px solid #e4e1da', color: '#4d5e56', borderRadius: '100px', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', cursor: 'pointer' }}>
            {copiedSubject ? t('copied') : t('copySubject')}
          </button>
          <button type="button" onClick={handleCopyMessage}
            style={{ flex: 1, padding: '10px', background: '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            {copied ? t('messageCopiedDesktop') : t('copyMessage')}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#94a3a0', textAlign: 'center' }}>
          {isMobile ? t('mobileInstructions') : t('desktopInstructions')}
        </p>

      </form>
    </div>
  )
}
