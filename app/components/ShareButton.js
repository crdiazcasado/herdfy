'use client'

import { useCallback } from 'react'

export default function ShareButton({ campaign }) {
  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}/c/${campaign.slug}`
    const message = `¡Únete a esta campaña! ${campaign.title} - ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }, [campaign.slug, campaign.title])

  return (
    <button
      onClick={handleShare}
      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
    >
      Compartir por WhatsApp
    </button>
  )
}