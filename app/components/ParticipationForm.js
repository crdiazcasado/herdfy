'use client'

import { useState, useEffect } from 'react'

export default function ParticipationForm({ campaign }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    localidad: '',
    email: ''
  })
  
  const [message, setMessage] = useState(campaign.email_template)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name !== 'email') {
      updateMessage(name, value)
    }
  }

  const updateMessage = (field, value) => {
    let updatedMessage = campaign.email_template
    
    if (formData.nombre || field === 'nombre') {
      updatedMessage = updatedMessage.replace(/\[NOMBRE\]/g, field === 'nombre' ? value : formData.nombre)
    }
    if (formData.dni || field === 'dni') {
      updatedMessage = updatedMessage.replace(/\[DNI\]/g, field === 'dni' ? value : formData.dni)
    }
    if (formData.localidad || field === 'localidad') {
      updatedMessage = updatedMessage.replace(/\[LOCALIDAD\]/g, field === 'localidad' ? value : formData.localidad)
    }
    
    setMessage(updatedMessage)
  }

  const handleMessageChange = (e) => {
    if (campaign.allow_edit) {
      setMessage(e.target.value)
    }
  }

  const getFinalMessage = () => {
    let finalMessage = message
    finalMessage = finalMessage.replace(/\[NOMBRE\]/g, formData.nombre)
    finalMessage = finalMessage.replace(/\[DNI\]/g, formData.dni)
    finalMessage = finalMessage.replace(/\[LOCALIDAD\]/g, formData.localidad)
    return finalMessage
  }

  const incrementParticipation = async () => {
    try {
      await fetch('/api/campaigns/participate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: campaign.slug }),
      })
    } catch (error) {
      console.error('Error incrementing participation:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Incrementar en segundo plano
    incrementParticipation()
    
    const finalMessage = getFinalMessage()
    const subject = encodeURIComponent(campaign.email_subject)
    const body = encodeURIComponent(finalMessage)
    const mailtoUrl = `mailto:${campaign.recipient_email}?subject=${subject}&body=${body}`
    
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
        
        if (successful) {
          resolve()
        } else {
          reject(new Error('Copy command failed'))
        }
      } catch (err) {
        document.body.removeChild(textarea)
        reject(err)
      }
    })
  }

  const handleCopy = async (e) => {
    e.preventDefault()
    
    const finalMessage = getFinalMessage()
    const fullText = `Para: ${campaign.recipient_email}\nAsunto: ${campaign.email_subject}\n\n${finalMessage}`
    
    try {
      await copyToClipboard(fullText)
      setCopied(true)
      
      // Incrementar después de copiar exitosamente
      incrementParticipation()
      
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      // Silencioso - no mostrar error
      console.log('Clipboard not available')
    }
  }

  return (
    <div className="rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ✍️ Participa ahora
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tu email *
          </label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="tu@email.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tu email solo se usa para enviarte copia si lo deseas
          </p>
        </div>

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

        <div className="space-y-3">
          <button 
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-lg font-medium"
          >
            Abrir mi cliente de email
          </button>

          {!isMobile && (
            <button 
              type="button"
              onClick={handleCopy}
              className="w-full px-6 py-3 border-1 border-primary text-primary rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              {copied ? '¡Copiado!' : 'Copiar mensaje'}
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500 text-center">
          <p>
            {isMobile 
              ? 'Se abrirá tu aplicación de correo con el mensaje preparado. Solo tienes que enviarlo.'
              : (
                <>
                  <strong>Opción 1:</strong> Haz clic en "Abrir mi cliente de email" para enviar directamente<br />
                  <strong>Opción 2:</strong> Si no funciona, usa "Copiar mensaje" y pégalo en tu email
                </>
              )
            }
          </p>
        </div>
      </form>
    </div>
  )
}
