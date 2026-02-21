import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ParticipationForm from '../../components/ParticipationForm'
import ShareButton from '../../components/ShareButton'
import CampaignDetailClient from '../../components/CampaignDetailClient'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

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

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {campaign.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <span>📅 Hasta el {formatDate(campaign.deadline)}</span>
              <span>⚡ {campaign.participation_count} participaciones</span>
            </div>

            {/* Creador */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
                {getCreatorName()[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-500">
                Creada por <span className="font-medium text-gray-700">{getCreatorName()}</span>
              </span>
            </div>
          </div>

          <div className="space-y-6">

            {/* Descripción */}
            <div className="bg-white p-6 rounded-lg border border-primary">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Por qué es importante?
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            {/* Destinatario con botón copiar */}
            <CampaignDetailClient
              recipientName={campaign.recipient_name}
              recipientEmail={campaign.recipient_email}
              campaign={campaign}
            />

            {/* Participación */}
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="p-6">
                <ParticipationForm campaign={campaign} />
              </div>

              {/* WhatsApp justo debajo */}
              <div className="px-6 pb-6 pt-0">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    📣 ¿Conoces a alguien que también debería participar? ¡Comparte!
                  </p>
                  <ShareButton campaign={campaign} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
