import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ParticipationForm from '../../components/ParticipationForm'
import ShareButton from '../../components/ShareButton'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

async function getCampaign(slug) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

export default async function CampaignDetail({ params }) {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.slug)
  
  if (!campaign) {
    notFound()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {campaign.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span>📅 Hasta el {formatDate(campaign.deadline)}</span>
              <span>⚡ {campaign.participation_count} participaciones</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-1 border-primary">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Por qué es importante?
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                📧 Destinatario
              </h2>
              <p className="text-gray-700 font-medium">{campaign.recipient_name}</p>
              <p className="text-gray-600">{campaign.recipient_email}</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <ParticipationForm campaign={campaign} />
            </div>

            <div className="pt-4">
              <ShareButton campaign={campaign} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
