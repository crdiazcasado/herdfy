'use client'

import { useState, useEffect, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import Modal from './Modal'

function getUsedFields(template) {
  return {
    nombre:    /\(NOMBRE\)/.test(template),
    dni:       /\(DNI\)/.test(template),
    localidad: /\(LOCALIDAD\)/.test(template),
    fecha:     /\(FECHA\)/.test(template),
  }
}

export default function ParticipationForm({ campaign }) {
  const used = getUsedFields(campaign.email_template)
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    localidad: '',
    fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    asunto: campaign.email_subject
  })
  const [message, setMessage] = useState(campaign.email_template)
  const [copied, setCopied] = useState(false)
  const [copiedRecipient, setCopiedRecipient] = useState(false)
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [thankYouModal, setThankYouModal] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(false)
  const turnstileRef = useRef(null)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    if (used.fecha) {
      const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
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
    await incrementParticipation()
    setTimeout(() => setThankYouModal(true), 800)
    window.location.href = `mailto:${campaign.recipient_email}?subject=${subject}&body=${body}`
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
      await copyToClipboard(campaign.recipient_email)
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

  return (
    <div>
      <Modal
        isOpen={thankYouModal}
        onClose={() => setThankYouModal(false)}
        title="¡Gracias por participar!"
        message="Tu mensaje está listo para enviar. Recuerda enviarlo desde tu cliente de email para que tu participación cuente."
        type="success"
      />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Asunto */}
        <div>
          <label style={labelStyle}>Asunto del email</label>
          <input type="text" name="asunto" value={formData.asunto}
            onChange={(e) => setFormData(prev => ({ ...prev, asunto: e.target.value }))}
            style={inputStyle} />
        </div>

        {/* Campos dinámicos — solo los que usa la plantilla */}
        {(used.nombre || used.dni) && (
          <div style={{ display: 'grid', gridTemplateColumns: used.nombre && used.dni ? '1fr 1fr' : '1fr', gap: '12px' }}>
            {used.nombre && (
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                  style={inputStyle} placeholder="Tu nombre y apellidos" />
              </div>
            )}
            {used.dni && (
              <div>
                <label style={labelStyle}>DNI</label>
                <input type="text" name="dni" value={formData.dni} onChange={handleChange}
                  style={inputStyle} placeholder="12345678A" />
              </div>
            )}
          </div>
        )}

        {used.localidad && (
          <div>
            <label style={labelStyle}>Localidad</label>
            <input type="text" name="localidad" value={formData.localidad} onChange={handleChange}
              style={inputStyle} placeholder="Tu ciudad o municipio" />
          </div>
        )}

        {used.fecha && (
          <div>
            <label style={labelStyle}>Fecha</label>
            <input type="text" name="fecha" value={formData.fecha}
              onChange={(e) => {
                const updated = { ...formData, fecha: e.target.value }
                setFormData(updated)
                updateMessage(updated)
              }}
              style={{ ...inputStyle, color: '#4d5e56' }} />
          </div>
        )}

        {/* Mensaje */}
        <div>
          <label style={labelStyle}>Mensaje {campaign.allow_edit && '(puedes editarlo)'}</label>
          <textarea rows="8" value={message} onChange={handleMessageChange} readOnly={!campaign.allow_edit}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55, background: campaign.allow_edit ? '#f8f7f4' : '#f0f0ee' }} />
        </div>

        {/* Turnstile */}
        <div>
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={(token) => { setTurnstileToken(token); setCaptchaError(false) }}
            onError={() => { setTurnstileToken(null); setCaptchaError(true) }}
            onExpire={() => setTurnstileToken(null)}
            options={{ theme: 'light', language: 'es', size: 'flexible' }}
            style={{ width: '100%' }}
          />
          {captchaError && (
            <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '4px' }}>
              Por favor, completa la verificación de seguridad.
            </p>
          )}
        </div>

        {/* Botones móvil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="md:hidden">
          {isMobile && (
            <button type="submit"
              style={{ width: '100%', padding: '12px', background: '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Enviar desde mi email
            </button>
          )}
          <button type="button" onClick={handleCopyMessage}
            style={{ width: '100%', padding: '11px', background: 'transparent', color: '#3a9e7a', border: '1.5px solid #3a9e7a', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            {copied ? '¡Mensaje copiado!' : 'Copiar mensaje'}
          </button>
        </div>

        {/* Botones desktop — 3 en fila */}
        <div style={{ display: 'none', gap: '10px' }} className="hidden md:flex">
          <button type="button" onClick={handleCopyRecipient}
            style={{ flex: 1, padding: '10px', border: '1.5px solid #e4e1da', color: '#4d5e56', borderRadius: '100px', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', cursor: 'pointer' }}>
            {copiedRecipient ? '✅ Copiado' : 'Copiar destinatario'}
          </button>
          <button type="button" onClick={handleCopySubject}
            style={{ flex: 1, padding: '10px', border: '1.5px solid #e4e1da', color: '#4d5e56', borderRadius: '100px', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', cursor: 'pointer' }}>
            {copiedSubject ? '✅ Copiado' : 'Copiar asunto'}
          </button>
          <button type="button" onClick={handleCopyMessage}
            style={{ flex: 1, padding: '10px', background: '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            {copied ? '✅ Mensaje copiado' : 'Copiar mensaje'}
          </button>
        </div>

        {/* Instrucciones */}
        <p style={{ fontSize: '12px', color: '#94a3a0', textAlign: 'center' }}>
          {isMobile
            ? 'Opción 1: pulsa "Enviar desde mi email" para abrirlo directamente. Opción 2: copia el mensaje y pégalo en tu email.'
            : 'Copia el mensaje, abre tu email y envíalo al destinatario indicado.'}
        </p>

      </form>
    </div>
  )
}