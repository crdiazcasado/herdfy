'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18nNavigation'

export default function CampaignCard({ campaign }) {
  const t = useTranslations('card')
  const locale = useLocale()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ca' ? 'ca-ES' : 'es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Link
      href={`/c/${campaign.slug}`}
      className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-auto"
    >
      <div className="flex-1 mb-2">
        <div className="relative mb-4">
          <img
            src={campaign.image_url || '/hero.webp'}
            className="w-full h-30 object-cover rounded-md"
            loading="lazy"
            width={400}
            height={120}
            alt={campaign.title}
          />
          {campaign.participation_count > 0 && (
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-sm">
              <span>⚡</span>
              <span className="text-primary">{campaign.participation_count}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {campaign.description}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{t('deadline', { date: formatDate(campaign.deadline) })}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
