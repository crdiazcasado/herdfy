'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'

export default function ParticipationForm({ campaign }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    localidad: ''
  })

  const [message, setMessage] = useState(campaign.email_template)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [thankYouModal, setThankYouModal] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    updateMessage(name, value)
  }

  const updateMessage = (field, value) => {
    let updatedMessage = campaign.email_template

    const nombre = field === 'nombre' ? value : formData.nombre
    const dni = field === 'dni' ? value : formData.dni
    const localidad = field === 'localidad' ? value : formData.localidad

    if (nombre) updatedMessage = updatedMessage.replace(/\(NOMBRE\)/g, nombre)
    if (dni) updatedMessage = updatedMessage.replace(/\(DNI\)/g, dni)
    if (localidad) updatedMessage = updatedMessage.replace(/\(LOCALIDAD\)/g, localidad)

    setMessage(updatedMessage)
  }

  const handleMessageChange = (e) => {
    if (campaign.allow_edit) setMessage(e.target.value)
  }

  const getFinalMessage = () => {
    let finalMessage = message
    finalMessage = finalMessage.replace(/\(NOMBRE\)/g, formData.nombre)
    finalMessage = finalMessage.replace(/\(DNI\)/g, formData.dni)
    finalMessage = finalMessage.replace(/\(LOCALIDAD\)/g, formData.localidad)
    return finalMessage
  }

  const incrementParticipation = async () => {
    try {
      await fetch('/api/campaigns/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: campaign.slug }),
      })
    } catch (error) {
      console.error('Error incrementando participación:', error)
    }
  }

  // Abre el cliente de email y cuenta +1 (solo móvil)
  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalMessage = getFinalMessage()
    const subject = encodeURIComponent(campaign.email_subject)
    const body = encodeURIComponent(finalMessage)
    const mailtoUrl = `mailto:${campaign.recipient_email}?subject=${subject}&body=${body}`

    // Contar participación solo al abrir el email
    await incrementParticipation()

    // Mostrar modal de agradecimiento tras pequeño delay
    // (el mailto abre el cliente externo, la página queda abierta)
    setTimeout(() => {
      setThankYouModal(true)
    }, 800)

    window.location.href = mailtoUrl
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textarea)
        successful ? resolve() : reject(new Error('Copy failed'))
      } catch (err) {
        document.body.removeChild(textarea)
        reject(err)
      }
    })
  }

  // Solo copia el mensaje, sin contar participación
  const handleCopyMessage = async (e) => {
    e.preventDefault()
    const finalMessage = getFinalMessage()
    try {
      await copyToClipboard(finalMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.log('Portapapeles no disponible')
    }
  }

  return (
    <div className="rounded-lg">
      {/* Modal de agradecimiento */}
      <Modal
        isOpen={thankYouModal}
        onClose={() => setThankYouModal(false)}
        title="¡Gracias por participar!"
        message="Tu mensaje está listo para enviar. Recuerda enviarlo desde tu cliente de email para que tu participación cuente."
        type="success"
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ✍️ Participa ahora
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tu nombre y apellidos"
          />
        </div>

        {/* DNI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DNI *
          </label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="12345678A"
          />
        </div>

        {/* Localidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localidad *
          </label>
          <input
            type="text"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tu ciudad"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje {campaign.allow_edit && '(puedes editarlo)'}
          </label>
          <textarea
            rows="8"
            value={message}
            onChange={handleMessageChange}
            readOnly={!campaign.allow_edit}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              !campaign.allow_edit ? 'bg-gray-50' : ''
            }`}
          />
        </div>

        {/* Botones — en móvil: primero "Enviar", luego "Copiar" */}
        <div className="space-y-3">
          {isMobile && (
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-lg font-medium"
            >
              Enviar desde mi email
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyMessage}
            className="w-full px-6 py-3 border border-primary text-primary rounded-lg hover:bg-green-50 transition-colors font-medium text-lg"
          >
            {copied ? '¡Mensaje copiado!' : 'Copiar mensaje'}
          </button>
        </div>

        {/* Instrucciones */}
        <div className="text-sm text-gray-500 text-center">
          {isMobile ? (
            <p>
              <strong>Opción 1:</strong> Pulsa "Enviar desde mi email" para abrirlo directamente.<br />
              <strong>Opción 2:</strong> Copia el mensaje y pégalo en tu email.
            </p>
          ) : (
            <p>
              Copia el mensaje, abre tu email y envíalo al destinatario indicado.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
