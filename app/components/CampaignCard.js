export default function CampaignCard({ campaign }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getCreatorName = () => {
    if (campaign.users?.name) {
      return campaign.users.name
    }
    if (campaign.users?.email) {
      return campaign.users.email.split('@')[0]
    }
    return 'Anónimo'
  }

  return (
    <a 
      href={`/c/${campaign.slug}`}
      className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-[370px]"
    >
      <div className="flex-1 mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-gray-600 line-clamp-4">
          {campaign.description}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>📧</span>
            <span className="font-medium truncate">{campaign.recipient_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>Hasta {formatDate(campaign.deadline)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="font-semibold text-primary">
              {campaign.participation_count} participaciones
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
            {getCreatorName()[0].toUpperCase()}
          </div>
          <span className="text-xs text-gray-500">
            Por {getCreatorName()}
          </span>
        </div>
      </div>
    </a>
  )
}
