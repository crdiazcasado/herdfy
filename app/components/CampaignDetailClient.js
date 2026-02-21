'use client'

import { useState } from 'react'
import ReportModal from './ReportModal'

export default function CampaignDetailClient({ recipientName, recipientEmail, campaign }) {
  const [copiedRecipient, setCopiedRecipient] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

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

  const handleCopyRecipient = async () => {
    try {
      await copyToClipboard(recipientEmail)
      setCopiedRecipient(true)
      setTimeout(() => setCopiedRecipient(false), 3000)
    } catch (err) {
      console.log('Portapapeles no disponible')
    }
  }

  return (
    <>
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        campaign={campaign}
      />

      <div className="bg-white p-6 rounded-lg border border-gray-300">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            📧 Destinatario
          </h2>
          {/* Botón denunciar */}
          <button
            onClick={() => setReportOpen(true)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <span>⚑</span>
            <span>Denunciar</span>
          </button>
        </div>

        <p className="text-gray-700 font-medium">{recipientName}</p>

        {/* Email con botón copiar */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-gray-600 text-sm flex-1">{recipientEmail}</p>
          <button
            onClick={handleCopyRecipient}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xs text-gray-600 whitespace-nowrap"
          >
            {copiedRecipient ? '✅ Copiado' : '📋 Copiar email'}
          </button>
        </div>
      </div>
    </>
  )
}
