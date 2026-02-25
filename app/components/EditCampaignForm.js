'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Modal from './Modal'
import { containsProfanity } from '../../lib/profanityFilter'
import ImageUpload from './ImageUpload'

export default function EditCampaignForm({ campaign }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' })

  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    deadline: campaign.deadline,
    recipient_name: campaign.recipient_name,
    recipient_email: campaign.recipient_email,
    email_subject: campaign.email_subject,
    email_template: campaign.email_template,
    allow_edit: campaign.allow_edit,
    status: campaign.status,
    image_url: campaign.image_url || ''
  })

  const showModal = (title, message, type = 'success') => {
    setModal({ isOpen: true, title, message, type })
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
    return fieldsToCheck.some(field => containsProfanity(field))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (validateContent()) {
      showModal(
        'Contenido no permitido',
        'El texto contiene palabras no permitidas. Por favor, revisa los campos y vuelve a intentarlo.',
        'error'
      )
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          title: formData.title,
          description: formData.description,
          recipient_name: formData.recipient_name,
          recipient_email: formData.recipient_email,
          deadline: formData.deadline,
          email_subject: formData.email_subject,
          email_template: formData.email_template,
          allow_edit: formData.allow_edit,
          status: formData.status,
          image_url: formData.image_url
        })
        .eq('id', campaign.id)

      if (updateError) throw updateError

      showModal('¡Cambios guardados!', 'La campaña se ha actualizado correctamente.', 'success')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1800)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id)

      if (deleteError) throw deleteError

      router.push('/dashboard')
      router.refresh()

    } catch (err) {
      setError(err.message)
      setDeleting(false)
      setShowDeleteConfirm(false)
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
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Información básica */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información básica</h2>

          <div className="space-y-4">

            {/* Imagen de portada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) =>
                  setFormData(prev => ({ ...prev, image_url: url }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                rows="6"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite *</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Borrador</option>
                <option value="active">Activa</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Destinatario */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Destinatario</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del organismo *</label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de destino *</label>
              <input
                type="email"
                name="recipient_email"
                value={formData.recipient_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Plantilla */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plantilla del mensaje</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del email *</label>
              <input
                type="text"
                name="email_subject"
                value={formData.email_subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo del mensaje *</label>

              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                <p className="font-medium mb-2">📌 Variables disponibles para personalizar el mensaje:</p>
                <div className="flex flex-wrap gap-2">
                  {['(NOMBRE)', '(DNI)', '(LOCALIDAD)'].map(v => (
                    <span key={v} className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-200 text-amber-900 font-mono font-semibold text-xs border border-amber-400">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                rows="12"
                name="email_template"
                value={formData.email_template}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allow_edit"
                name="allow_edit"
                checked={formData.allow_edit}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="allow_edit" className="ml-2 text-sm text-gray-700">
                Permitir que los participantes editen el mensaje
              </label>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3">
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              🗑️ Eliminar campaña
            </button>
          </div>
        </div>
      </form>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗑️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              ¿Eliminar campaña?
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Esta acción no se puede deshacer. La campaña y todas sus participaciones se eliminarán permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}