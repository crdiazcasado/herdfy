'use client'

import { useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Modal from './Modal'
import { findProfanity } from '../../lib/profanityFilter'
import ImageUpload from './ImageUpload'

export default function CreateCampaignForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' })
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(false)
  const turnstileRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '', description: '', deadline: '',
    recipient_name: '', recipient_email: '',
    email_subject: '', email_template: '',
    allow_edit: true, image_url: ''
  })

  const showModal = (title, message, type = 'success') => setModal({ isOpen: true, title, message, type })

  const generateSlug = (title) => title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validateContent = () => {
    const fields = [formData.title, formData.description, formData.email_template, formData.email_subject, formData.recipient_name]
    const found = fields.flatMap(f => findProfanity(f))
    return [...new Set(found)]
  }

  const verifyTurnstile = async (token) => {
    try {
      const res = await fetch('/api/verify-turnstile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      const data = await res.json()
      return data.success
    } catch { return false }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null); setCaptchaError(false); setImageError(false)

    if (!formData.image_url) { setImageError(true); setLoading(false); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    if (!turnstileToken) { setCaptchaError(true); setLoading(false); return }

    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) { setCaptchaError(true); turnstileRef.current?.reset(); setTurnstileToken(null); setLoading(false); return }

    const profanityFound = validateContent()
    if (profanityFound.length > 0) {
      showModal('Contenido no permitido', `El texto contiene palabras no permitidas: "${profanityFound.join('", "')}".`, 'error')
      setLoading(false); return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Debes iniciar sesión para crear una campaña'); setLoading(false); return }

      const slug = generateSlug(formData.title)
      const { error: insertError } = await supabase.from('campaigns').insert([{
        created_by: user.id, title: formData.title, slug, description: formData.description,
        recipient_name: formData.recipient_name, recipient_email: formData.recipient_email,
        deadline: formData.deadline, email_subject: formData.email_subject,
        email_template: formData.email_template, allow_edit: formData.allow_edit,
        image_url: formData.image_url, status: 'active'
      }]).select()

      if (insertError) throw insertError
      showModal('¡Campaña creada!', 'Tu campaña se ha creado con éxito.', 'success')
      setTimeout(() => router.push('/dashboard'), 1800)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const sectionStyle = { background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }
  const sectionTitleStyle = { fontFamily: 'Fraunces, Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#1c2b22', margin: 0 }
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 500, color: '#364153', marginBottom: '6px' }
  const inputStyle = { width: '100%', padding: '9px 13px', border: '1.5px solid #e4e1da', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1c2b22', background: '#f8f7f4', outline: 'none', boxSizing: 'border-box' }

  return (
    <>
      <Modal isOpen={modal.isOpen} onClose={() => setModal(p => ({ ...p, isOpen: false }))} title={modal.title} message={modal.message} type={modal.type} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && <div style={{ padding: '10px 14px', background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', fontSize: '13px' }}>{error}</div>}

        {/* Información básica */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Información básica</h2>
          <div>
            <label style={labelStyle}>Imagen de portada *</label>
            <ImageUpload error={imageError} onImageUploaded={(url) => { setFormData(prev => ({ ...prev, image_url: url })); setImageError(false) }} />
          </div>
          <div>
            <label style={labelStyle}>Título de la campaña *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="Ej: Protección para perros de caza" />
          </div>
          <div>
            <label style={labelStyle}>Descripción *</label>
            <textarea rows="6" name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }} placeholder="Explica por qué es importante esta campaña..." />
          </div>
          <div>
            <label style={labelStyle}>Fecha límite *</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        {/* Destinatario */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Destinatario</h2>
          <div>
            <label style={labelStyle}>Nombre del organismo *</label>
            <input type="text" name="recipient_name" value={formData.recipient_name} onChange={handleChange} required style={inputStyle} placeholder="Ej: Ministerio de Agricultura" />
          </div>
          <div>
            <label style={labelStyle}>Email de destino *</label>
            <input type="email" name="recipient_email" value={formData.recipient_email} onChange={handleChange} required style={inputStyle} placeholder="consulta@ministerio.es" />
          </div>
        </div>

        {/* Plantilla */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Plantilla del mensaje</h2>
          <div>
            <label style={labelStyle}>Asunto del email *</label>
            <input type="text" name="email_subject" value={formData.email_subject} onChange={handleChange} required style={inputStyle} placeholder="Alegaciones al Real Decreto..." />
          </div>
          <div>
            <label style={labelStyle}>Cuerpo del mensaje *</label>
            <div style={{ marginBottom: '10px', padding: '12px 14px', background: '#fffbe6', border: '1px solid #f6e05e', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#744210', marginBottom: '8px' }}>
                📌 Usa estas variables donde quieras insertar los datos del participante:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {['(NOMBRE)', '(DNI)', '(LOCALIDAD)', '(FECHA)'].map(v => (
                  <span key={v} style={{ padding: '3px 10px', background: '#fef08a', border: '1px solid #ecc94b', borderRadius: '5px', fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: '#744210' }}>{v}</span>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: '#92400e', margin: 0 }}>
                Solo aparecerán los campos que uses. Si no pones <code>(DNI)</code>, no se lo pediremos al participante.
              </p>
            </div>
            <textarea rows="12" name="email_template" value={formData.email_template} onChange={handleChange} required
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55, fontFamily: 'monospace', fontSize: '13px' }}
              placeholder="D./Dª (NOMBRE), con DNI (DNI), vecino/a de (LOCALIDAD), a (FECHA)..." />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" id="allow_edit" name="allow_edit" checked={formData.allow_edit} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#3a9e7a' }} />
            <label htmlFor="allow_edit" style={{ fontSize: '13px', color: '#4d5e56', cursor: 'pointer' }}>Permitir que los participantes editen el mensaje</label>
          </div>
        </div>

        {/* Turnstile */}
        <div style={{ background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', padding: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3a0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Verificación de seguridad *</p>
          <div className="turnstile-wrapper">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => { setTurnstileToken(token); setCaptchaError(false) }}
              onError={() => { setTurnstileToken(null); setCaptchaError(true) }}
              onExpire={() => setTurnstileToken(null)}
              options={{ theme: 'light', language: 'es', size: 'flexible' }}
              style={{ width: '100%' }}
            />
          </div>
          {captchaError && <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '6px' }}>Por favor, completa la verificación de seguridad.</p>}
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={loading}
            style={{ flex: 1, padding: '12px', background: loading ? '#94a3a0' : '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creando...' : 'Crear campaña'}
          </button>
          <a href="/dashboard" style={{ padding: '12px 24px', border: '1.5px solid #e4e1da', color: '#4d5e56', borderRadius: '100px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            Cancelar
          </a>
        </div>
      </form>
    </>
  )
}