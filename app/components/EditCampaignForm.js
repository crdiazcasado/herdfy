'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Modal from './Modal'
import { findProfanity } from '../../lib/profanityFilter'
import ImageUpload from './ImageUpload'

const today = new Date().toISOString().split('T')[0]

export default function EditCampaignForm({ campaign }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' })

  // Si la fecha ha vencido y el estado es active, lo tratamos como inactive
  const isAutoInactive = campaign.status === 'active' && campaign.deadline && campaign.deadline < today

  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    deadline: campaign.deadline,
    recipient_name: campaign.recipient_name,
    recipient_email: campaign.recipient_email,
    email_subject: campaign.email_subject,
    email_template: campaign.email_template,
    allow_edit: campaign.allow_edit,
    status: isAutoInactive ? 'inactive' : (campaign.status === 'closed' ? 'inactive' : campaign.status),
    image_url: campaign.image_url || '',
    inactive_since: campaign.inactive_since || null,
  })

  const showModal = (title, message, type = 'success') => setModal({ isOpen: true, title, message, type })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validateContent = () => {
    const fields = [formData.title, formData.description, formData.email_template, formData.email_subject, formData.recipient_name]
    const found = fields.flatMap(f => findProfanity(f))
    return [...new Set(found)]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)

    const profanityFound = validateContent()
    if (profanityFound.length > 0) {
      showModal('Contenido no permitido', `El texto contiene palabras no permitidas: "${profanityFound.join('", "')}".`, 'error')
      setLoading(false); return
    }

    // Gestión de inactive_since
    let inactive_since = formData.inactive_since
    if (formData.status === 'inactive' && !inactive_since) {
      inactive_since = new Date().toISOString()
    } else if (formData.status === 'active') {
      inactive_since = null
    }

    try {
      const { error: updateError } = await supabase.from('campaigns').update({
        title: formData.title,
        description: formData.description,
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        deadline: formData.deadline,
        email_subject: formData.email_subject,
        email_template: formData.email_template,
        allow_edit: formData.allow_edit,
        status: formData.status,
        image_url: formData.image_url,
        inactive_since,
      }).eq('id', campaign.id)

      if (updateError) throw updateError
      showModal('¡Cambios guardados!', 'La campaña se ha actualizado correctamente.', 'success')
      setTimeout(() => { router.push('/dashboard'); router.refresh() }, 1800)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async () => {
    setDeleting(true); setError(null)
    try {
      const { error: deleteError } = await supabase.from('campaigns').delete().eq('id', campaign.id)
      if (deleteError) throw deleteError
      router.push('/dashboard'); router.refresh()
    } catch (err) { setError(err.message); setDeleting(false); setShowDeleteConfirm(false) }
  }

  const sectionStyle = { background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', padding: '24px', marginBottom: '16px' }
  const sectionTitleStyle = { fontFamily: 'Fraunces, Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#1c2b22', marginBottom: '18px' }
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 500, color: '#364153', marginBottom: '6px' }
  const inputStyle = { width: '100%', padding: '9px 13px', border: '1.5px solid #e4e1da', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1c2b22', background: '#f8f7f4', outline: 'none', boxSizing: 'border-box' }

  return (
    <>
      <Modal isOpen={modal.isOpen} onClose={() => setModal(p => ({ ...p, isOpen: false }))} title={modal.title} message={modal.message} type={modal.type} />

      <form onSubmit={handleSubmit}>
        {error && <div style={{ padding: '10px 14px', background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Información básica</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Imagen de portada</label>
              <ImageUpload currentImageUrl={formData.image_url} onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))} />
            </div>
            <div>
              <label style={labelStyle}>Título *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Descripción *</label>
              <textarea rows="6" name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }} />
            </div>
            <div>
              <label style={labelStyle}>Fecha límite *</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required min={today} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Estado *</label>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="active">Activa — visible para todo el mundo</option>
                <option value="inactive">Inactiva — solo visible para ti</option>
                <option value="draft">Borrador — solo visible para ti</option>
              </select>
              {isAutoInactive && formData.status === 'inactive' && (
                <p style={{ fontSize: '12px', color: '#94a3a0', marginTop: '6px' }}>
                  La campaña pasó a inactiva automáticamente porque venció la fecha límite.
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Destinatario</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Nombre del organismo *</label>
              <input type="text" name="recipient_name" value={formData.recipient_name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email de destino *</label>
              <input type="email" name="recipient_email" value={formData.recipient_email} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Plantilla del mensaje</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Asunto del email *</label>
              <input type="text" name="email_subject" value={formData.email_subject} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cuerpo del mensaje *</label>
              <div style={{ marginBottom: '10px', padding: '12px 14px', background: '#fffbe6', border: '1px solid #f6e05e', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#744210', marginBottom: '8px' }}>
                  📌 Variables disponibles para personalizar el mensaje:
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
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55, fontFamily: 'monospace', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="allow_edit" name="allow_edit" checked={formData.allow_edit} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#3a9e7a' }} />
              <label htmlFor="allow_edit" style={{ fontSize: '13px', color: '#4d5e56', cursor: 'pointer' }}>Permitir que los participantes editen el mensaje</label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading}
            style={{ flex: 1, minWidth: '140px', padding: '12px', background: loading ? '#94a3a0' : '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button type="button" onClick={() => router.push('/dashboard')}
            style={{ flex: 1, minWidth: '140px', padding: '12px', background: 'transparent', color: '#4d5e56', border: '1.5px solid #e4e1da', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="button" onClick={() => setShowDeleteConfirm(true)}
            style={{ flex: 1, minWidth: '140px', padding: '12px', background: '#fff5f5', color: '#c53030', border: '1.5px solid #fed7d7', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            🗑️ Eliminar campaña
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,43,34,0.45)' }} onClick={() => setShowDeleteConfirm(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(28,43,34,0.18)', maxWidth: '400px', width: '100%', padding: '32px', zIndex: 10, textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '26px' }}>🗑️</div>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1c2b22', marginBottom: '8px' }}>¿Eliminar campaña?</h3>
            <p style={{ fontSize: '14px', color: '#4d5e56', marginBottom: '24px', lineHeight: 1.6 }}>
              Esta acción no se puede deshacer. La campaña y todas sus participaciones se eliminarán permanentemente.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, padding: '11px', background: deleting ? '#94a3a0' : '#e53e3e', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 700, fontSize: '14px', cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting}
                style={{ flex: 1, padding: '11px', background: 'transparent', color: '#4d5e56', border: '1.5px solid #e4e1da', borderRadius: '100px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}