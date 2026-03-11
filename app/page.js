'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import CampaignCard from './components/CampaignCard'
import NoResults from './components/NoResults'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 12 

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`*, users (name, email, avatar_color)`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setCampaigns(data)
        setFilteredCampaigns(data)
      }
      setLoading(false)
    }
    loadCampaigns()
  }, [])

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredCampaigns(campaigns)
      setActiveSearch('')
      setCurrentPage(1)
      return
    }
    const query = searchQuery.toLowerCase()
    const filtered = campaigns.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.recipient_name.toLowerCase().includes(query)
    )
    setFilteredCampaigns(filtered)
    setActiveSearch(searchQuery)
    setCurrentPage(1)
  }, [searchQuery, campaigns])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleSearch()
  }, [handleSearch])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    setActiveSearch('')
    setFilteredCampaigns(campaigns)
    setCurrentPage(1)
  }, [campaigns])

  const getSuggestions = useCallback(() => {
    return [...campaigns].sort(() => 0.5 - Math.random()).slice(0, 3)
  }, [campaigns])

  // Paginación
  const totalPages = Math.ceil(filteredCampaigns.length / PAGE_SIZE)
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <div
          className="relative py-12 md:py-16 bg-cover bg-center"
          style={{ backgroundImage: 'url(/sheep-hero.jpg)' }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-2">
              Tu participación lo cambia todo.
            </h1>
            <p className="text-lg md:text-2xl text-white mb-8">
              Únete a miles de personas y haz que las cosas cambien.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 bg-white p-2 md:p-3 rounded-xl shadow-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Buscar campañas, usuarios..."
                  className="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-lg"
                />
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-base md:text-lg"
                >
                  Buscar
                </button>
              </div>

              <div className="h-10 mt-3">
                {activeSearch && (
                  <div
                    className="text-xs md:text-sm text-white px-3 md:px-4 py-2 rounded-lg text-left flex items-center gap-2 overflow-hidden"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <span className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                      <span className="whitespace-nowrap flex-shrink-0">
                        {filteredCampaigns.length === 0
                          ? 'No se encontraró:'
                          : `${filteredCampaigns.length} resultado${filteredCampaigns.length !== 1 ? 's' : ''} para`
                        }
                      </span>
                      <span className="truncate text-teal-100 font-medium">"{activeSearch}"</span>
                    </span>
                    <button
                      onClick={handleClearSearch}
                      className="text-teal-200 hover:underline whitespace-nowrap flex-shrink-0"
                    >
                      Limpiar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                  <div className="w-full h-28 bg-gray-100 rounded-md animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2 mt-4" />
                </div>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={currentPage === 1}
                    style={{ padding: '8px 16px', borderRadius: '100px', border: '1.5px solid #e4e1da', background: 'white', color: currentPage === 1 ? '#94a3a0' : '#1c2b22', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
                  >
                    ← Anterior
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      style={{ width: '36px', height: '36px', borderRadius: '100px', border: '1.5px solid', borderColor: currentPage === i + 1 ? '#3a9e7a' : '#e4e1da', background: currentPage === i + 1 ? '#3a9e7a' : 'white', color: currentPage === i + 1 ? 'white' : '#1c2b22', cursor: 'pointer', fontSize: '14px', fontWeight: currentPage === i + 1 ? 700 : 400 }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={currentPage === totalPages}
                    style={{ padding: '8px 16px', borderRadius: '100px', border: '1.5px solid #e4e1da', background: 'white', color: currentPage === totalPages ? '#94a3a0' : '#1c2b22', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <NoResults
              searchQuery={activeSearch}
              onClear={handleClearSearch}
            />
          )}
        </div>
      </main>

    </div>
  )
}