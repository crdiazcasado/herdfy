'use client'

import { useState } from 'react'

const REPORT_REASONS = [
  'Contenido falso o engañoso',
  'Lenguaje ofensivo o inapropiado',
  'Spam o campaña duplicada',
  'Información personal expuesta',
  'Incita al odio o a la violencia',
  'Otro motivo'
]

export default function ReportModal({ isOpen, onClose, campaign }) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason) return
    setLoading(true)

    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignTitle: campaign.title,
          campaignSlug: campaign.slug,
          reason,
          details
        })
      })
      setSent(true)
    } catch (err) {
      console.error('Error sending report:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setReason('')
    setDetails('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10">
        {sent ? (
          // Estado: enviado
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Gracias por avisarnos!
            </h3>
            <p className="text-gray-600 mb-6">
              Hemos recibido tu denuncia y revisaremos el contenido de esta campaña lo antes posible.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        ) : (
          // Formulario
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Denunciar campaña
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Si crees que esta campaña incumple nuestras normas, indícanos el motivo y lo revisaremos.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="">Selecciona un motivo...</option>
                  {REPORT_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detalles adicionales
                </label>
                <textarea
                  rows="4"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explícanos con más detalle qué has encontrado..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !reason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar denuncia'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
