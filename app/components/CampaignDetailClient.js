'use client'
import { useState } from 'react'
import ReportModal from './ReportModal'

export default function CampaignDetailClient({ recipientName, recipientEmail, campaign }) {
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <>
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        campaign={campaign}
      />
      {/* Caja destinatario — sin botón copiar */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Destinatario</h2>
        <p className="text-gray-700 font-medium">{recipientName}</p>
        <p className="text-gray-600 text-sm mt-1">{recipientEmail}</p>
      </div>
    </>
  )
}