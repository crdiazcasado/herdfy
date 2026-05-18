'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ReportModal from './ReportModal'

export default function CampaignDetailClient({ recipients, campaign }) {
  const t = useTranslations('campaign')
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <>
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        campaign={campaign}
      />
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {recipients.length === 1 ? t('recipient') : t('recipients')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recipients.map((r, i) => (
            <div key={i} style={recipients.length > 1 ? { paddingBottom: '8px', borderBottom: i < recipients.length - 1 ? '1px solid #e5e7eb' : 'none' } : {}}>
              <p className="text-gray-700 text-sm">{r.name}</p>
              <p className="text-gray-500 text-sm mt-1">{r.email}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
