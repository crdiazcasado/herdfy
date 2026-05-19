'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'

export default function ShareButton({ campaign }) {
  const t = useTranslations('campaign')

  const handleShare = useCallback(() => {
    const shareUrl = window.location.href
    const message = `${t('shareMessage', { title: campaign.title })} ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }, [campaign.title, t])

  return (
    <button
      onClick={handleShare}
      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
    >
      {t('shareButton')}
    </button>
  )
}
