'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateCampaignForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    recipient_name: '',
    recipient_email: '',
    email_subject: '',
    email_template: '',
    allow_edit: true
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Debes iniciar sesión para crear una campaña')
        setLoading(false)
        return
      }

      const slug = generateSlug(formData.title)

      const { data, error: insertError } = await supabase
        .from('campaigns')
        .insert([
          {
            created_by: user.id,
            title: formData.title,
            slug: slug,
            description: formData.description,
            recipient_name: formData.recipient_name,
            recipient_email: formData.recipient_email,
            deadline: formData.deadline,
            email_subject: formData.email_subject,
            email_template: formData.email_template,
            allow_edit: formData.allow_edit,
            status: 'active'
          }
        ])
        .select()

      if (insertError) throw insertError

      alert('¡Campaña creada con éxito!')
      router.push('/dashboard')
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información básica
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la campaña *
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Protección para perros de caza"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea 
              rows="6"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Explica por qué es importante esta campaña..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha límite *
            </label>
            <input 
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Destinatario
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del organismo *
            </label>
            <input 
              type="text"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Ministerio de Agricultura"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de destino *
            </label>
            <input 
              type="email"
              name="recipient_email"
              value={formData.recipient_email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="consulta@ministerio.es"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Plantilla del mensaje
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asunto del email *
            </label>
            <input 
              type="text"
              name="email_subject"
              value={formData.email_subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Alegaciones al Real Decreto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuerpo del mensaje *
            </label>
            <textarea 
              rows="12"
              name="email_template"
              value={formData.email_template}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="D./Dª [NOMBRE], con DNI [DNI]..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Usa [NOMBRE], [DNI], [LOCALIDAD] donde quieras que se inserte la información del participante
            </p>
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

      <div className="flex gap-4">
        <button 
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : 'Crear campaña'}
        </button>
        
          <a href="/dashboard"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
