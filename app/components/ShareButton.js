'use client'

export default function ShareButton({ campaign }) {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${campaign.slug}`
  const message = `¡Únete a esta campaña! ${campaign.title} - ${shareUrl}`
  
  const handleShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
    >
      Compartir por WhatsApp
    </button>
  )
}
