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
    title: '',
    description: '',
    deadline: '',
    recipient_name: '',
    recipient_email: '',
    email_subject: '',
    email_template: '',
    allow_edit: true,
    image_url: ''
  })

  const showModal = (title, message, type = 'success') => {
    setModal({ isOpen: true, title, message, type })
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateContent = () => {
    const fieldsToCheck = [
      formData.title,
      formData.description,
      formData.email_template,
      formData.email_subject,
      formData.recipient_name
    ]
    const found = fieldsToCheck.flatMap(field => findProfanity(field))
    return [...new Set(found)] // elimina duplicados
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
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setCaptchaError(false)
    setImageError(false)

    if (!formData.image_url) {
      setImageError(true)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!turnstileToken) {
      setCaptchaError(true)
      setLoading(false)
      return
    }

    const validCaptcha = await verifyTurnstile(turnstileToken)
    if (!validCaptcha) {
      setCaptchaError(true)
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      setLoading(false)
      return
    }

    const profanityFound = validateContent()
    if (profanityFound.length > 0) {
      showModal(
        'Contenido no permitido',
        `El texto contiene palabras no permitidas: "${profanityFound.join('", "')}". Por favor, revisa los campos y vuelve a intentarlo.`,
        'error'
      )
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Debes iniciar sesión para crear una campaña')
        setLoading(false)
        return
      }

      const slug = generateSlug(formData.title)

      const { error: insertError } = await supabase
        .from('campaigns')
        .insert([{
          created_by: user.id,
          title: formData.title,
          slug,
          description: formData.description,
          recipient_name: formData.recipient_name,
          recipient_email: formData.recipient_email,
          deadline: formData.deadline,
          email_subject: formData.email_subject,
          email_template: formData.email_template,
          allow_edit: formData.allow_edit,
          image_url: formData.image_url,
          status: 'active'
        }])
        .select()

      if (insertError) throw insertError

      showModal('¡Campaña creada!', 'Tu campaña se ha creado con éxito.', 'success')
      setTimeout(() => router.push('/dashboard'), 1800)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {/* Información básica */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información básica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada *</label>
              <ImageUpload
                error={imageError}
                onImageUploaded={(url) => {
                  setFormData(prev => ({ ...prev, image_url: url }))
                  setImageError(false)
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título de la campaña *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Protección para perros de caza" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea rows="6" name="description" value={formData.description} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Explica por qué es importante esta campaña..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite *</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* Destinatario */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Destinatario</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del organismo *</label>
              <input type="text" name="recipient_name" value={formData.recipient_name} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Ministerio de Agricultura" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de destino *</label>
              <input type="email" name="recipient_email" value={formData.recipient_email} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="consulta@ministerio.es" />
            </div>
          </div>
        </div>

        {/* Plantilla */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plantilla del mensaje</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del email *</label>
              <input type="text" name="email_subject" value={formData.email_subject} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Alegaciones al Real Decreto..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo del mensaje *</label>
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                <p className="font-medium mb-2">📌 Usa estas variables donde quieras insertar los datos del participante:</p>
                <div className="flex flex-wrap gap-2">
                  {['(NOMBRE)', '(DNI)', '(LOCALIDAD)', '(FECHA)'].map(v => (
                    <span key={v} className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-200 text-amber-900 font-mono font-semibold text-xs border border-amber-400">
                      {v}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-amber-700">
                  Ejemplo: <em>"D./Dª (NOMBRE), con DNI (DNI), vecino/a de (LOCALIDAD), a (FECHA)..."</em>
                </p>
              </div>
              <textarea rows="12" name="email_template" value={formData.email_template} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                placeholder="D./Dª (NOMBRE), con DNI (DNI), vecino/a de (LOCALIDAD)..." />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="allow_edit" name="allow_edit" checked={formData.allow_edit} onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded outline-none focus:ring-primary" />
              <label htmlFor="allow_edit" className="ml-2 text-sm text-gray-700">
                Permitir que los participantes editen el mensaje
              </label>
            </div>
          </div>
        </div>

        {/* Turnstile CAPTCHA */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Verificación de seguridad *</p>
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
            <p className="text-sm text-red-600 mt-2">Por favor, completa la verificación de seguridad.</p>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creando...' : 'Crear campaña'}
          </button>
          <a href="/dashboard"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center">
            Cancelar
          </a>
        </div>
      </form>
    </>
  )
}