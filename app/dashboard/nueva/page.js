import CreateCampaignForm from '../../components/CreateCampaignForm'

export default function NewCampaign() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Crear nueva campaña
          </h1>

          <CreateCampaignForm />
        </div>
      </main>
      
    </div>
  )
}
