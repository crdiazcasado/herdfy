import Link from 'next/link'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getCreatorName = (users) => {
  if (users?.name) return users.name
  if (users?.email) return users.email.split('@')[0]
  return 'Anónimo'
}

const AVATAR_COLORS = {
  violet: 'bg-violet-200 text-violet-700',
  blue:   'bg-blue-200 text-blue-700',
  green:  'bg-green-200 text-green-700',
  yellow: 'bg-yellow-200 text-yellow-700',
  orange: 'bg-orange-200 text-orange-700',
  pink:   'bg-pink-200 text-pink-700',
  teal:   'bg-teal-200 text-teal-700',
  red:    'bg-red-200 text-red-700',
}

export default function CampaignCard({ campaign }) {
  const creatorName = getCreatorName(campaign.users)
  const avatarClass = AVATAR_COLORS[campaign.users?.avatar_color] || AVATAR_COLORS.violet

  return (
    <Link
      href={`/c/${campaign.slug}`}
      className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-auto"
    >
      <div className="flex-1 mb-2">
        <img
          src={campaign.image_url || '/sheep-hero.jpg'}
          className="w-full h-30 object-cover rounded-md mb-4"
          loading="lazy"
          width={400}
          height={120}
          alt={campaign.title}
        />
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
            <span>Hasta {formatDate(campaign.deadline)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 ${avatarClass} rounded-full flex items-center justify-center text-xs font-medium`}>
              {creatorName[0].toUpperCase()}
            </div>
            <span className="text-xs text-gray-500">Por {creatorName}</span>
          </div>

          {campaign.participation_count > 0 && (
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
              <span>⚡</span>
              <span className="text-primary">{campaign.participation_count}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}