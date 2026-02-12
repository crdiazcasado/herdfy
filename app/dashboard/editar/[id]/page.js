import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import EditCampaignForm from '../../../components/EditCampaignForm'
import { supabase } from '../../../../lib/supabase'
import { notFound } from 'next/navigation'

async function getCampaign(id) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

export default async function EditCampaign({ params }) {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.id)
  
  if (!campaign) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Editar campaña
          </h1>

          <EditCampaignForm campaign={campaign} />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
