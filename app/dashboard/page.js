'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const today = new Date().toISOString().split('T')[0]

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getEffectiveStatus = (campaign) => {
  if (campaign.status === 'draft') return 'draft'
  if (campaign.status === 'inactive') return 'inactive'
  if (campaign.status === 'active' && campaign.deadline && campaign.deadline < today) return 'inactive'
  return 'active'
}

const statusConfig = {
  active:   { label: 'Activa',    classes: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactiva',  classes: 'bg-orange-100 text-orange-700' },
  draft:    { label: 'Borrador',  classes: 'bg-yellow-100 text-yellow-700' },
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadCampaigns = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (!error && data) setCampaigns(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      loadCampaigns(user.id)
    }
    checkUser()
  }, [router, loadCampaigns])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis campañas</h1>
            <Link href="/dashboard/nueva" className="w-full md:w-auto text-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium">
              + Nueva campaña
            </Link>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">Cargando campañas...</p>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const effectiveStatus = getEffectiveStatus(campaign)
                const { label, classes } = statusConfig[effectiveStatus]
                return (
                  <div key={campaign.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                        <p className="text-sm md:text-base text-gray-600 mb-3">
                          {campaign.recipient_name} · {campaign.recipient_email}
                        </p>
                        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                          <span>📅 {formatDate(campaign.deadline)}</span>
                          <span>⚡ {campaign.participation_count} participaciones</span>
                          <span className={`px-2 py-1 rounded ${classes}`}>{label}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200">
                        <Link href={`/dashboard/editar/${campaign.id}`}
                          className="px-4 py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                          Editar
                        </Link>
                        <Link href={`/c/${campaign.slug}`} target="_blank"
                          className="px-4 py-3 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                          Ver
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-6xl mb-4">🐑</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no has creado ninguna campaña</h3>
              <p className="text-gray-600 mb-6">Crea tu primera campaña y empieza a movilizar al rebaño</p>
              <Link href="/dashboard/nueva" className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium">
                Crear mi primera campaña
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}