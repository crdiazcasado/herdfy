import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ParticipationForm from '../../components/ParticipationForm'
import ShareButton from '../../components/ShareButton'
import CampaignDetailClient from '../../components/CampaignDetailClient'
import ReportButton from '../../components/ReportButton'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import ScrollHint from '../../components/ScrollHint'

export const revalidate = 180

async function getCampaign(slug) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export default async function CampaignDetail({ params }) {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.slug)
  if (!campaign) notFound()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCreatorName = () => {
    if (campaign.users?.name) return campaign.users.name
    if (campaign.users?.email) return campaign.users.email.split('@')[0]
    return 'Anónimo'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

          <div className="flex flex-col md:flex-row md:gap-5 items-start">

            {/* Columna izquierda — 1/3 */}
            <div className="w-full md:w-1/3 space-y-4 mb-6">

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <img
                  src={campaign.image_url || '/sheep-hero.jpg'}
                  alt={campaign.title}
                  className="w-full h-52 object-cover"
                  loading="eager"
                  width={600}
                  height={208}
                />

                <div className="p-5 space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {campaign.title}
                  </h1>

                  {/* Creador */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {getCreatorName()[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-500">
                      Por <span className="font-medium text-gray-700">{getCreatorName()}</span>
                    </span>
                  </div>

                  {/* Estadísticas */}
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <span>📅 Hasta el {formatDate(campaign.deadline)}</span>
                    {/* Solo muestra el contador si hay participaciones */}
                    {campaign.participation_count > 0 && (
                      <span>⚡ <strong className="text-gray-900">{campaign.participation_count}</strong> participaciones</span>
                    )}
                  </div>

                  {/* Destinatario */}
                  <div className="">
                    <CampaignDetailClient
                      recipientName={campaign.recipient_name}
                      recipientEmail={campaign.recipient_email}
                      campaign={campaign}
                    />
                  </div>
                </div>
              </div>
             
            </div>

            {/* Columna derecha — 2/3 */}
            <div className="w-full md:w-2/3 space-y-6">

              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Por qué es importante?
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <ParticipationForm campaign={campaign} />
                </div>

                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      📣 ¿Conoces a alguien que también debería participar? ¡Comparte!
                    </p>
                    <ShareButton campaign={campaign} />
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <ReportButton campaign={campaign} />
                </div>
              </div>

            </div>
          </div>

        </div>
 <ScrollHint />
      </main>
      <Footer />
    </div>
  )
}