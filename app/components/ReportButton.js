'use client'

import { useState } from 'react'
import ReportModal from './ReportModal'

export default function ReportButton({ campaign }) {
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <>
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        campaign={campaign}
      />
      <div className="border-t border-gray-200 pt-4 flex justify-center">
        <button
          onClick={() => setReportOpen(true)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <span>⚑</span>
          <span>Denunciar esta campaña</span>
        </button>
      </div>
    </>
  )
}
