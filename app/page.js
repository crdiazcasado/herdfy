'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CampaignCard from './components/CampaignCard'
import NoResults from './components/NoResults'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [loading, setLoading] = useState(true)

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
  }, [searchQuery, campaigns])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleSearch()
  }, [handleSearch])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    setActiveSearch('')
    setFilteredCampaigns(campaigns)
  }, [campaigns])

  const getSuggestions = useCallback(() => {
    return [...campaigns].sort(() => 0.5 - Math.random()).slice(0, 3)
  }, [campaigns])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
                    className="text-xs md:text-sm text-white px-3 md:px-4 py-2 rounded-lg text-left"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    {filteredCampaigns.length === 0 ? (
                      <span>No se encontraron campañas con "{activeSearch}"</span>
                    ) : (
                      <span>
                        {filteredCampaigns.length} resultado{filteredCampaigns.length !== 1 ? 's' : ''} para "{activeSearch}"
                        {filteredCampaigns.length !== campaigns.length && (
                          <button onClick={handleClearSearch} className="ml-2 text-teal-200 hover:underline">
                            Limpiar búsqueda
                          </button>
                        )}
                      </span>
                    )}
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

            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <NoResults
              searchQuery={activeSearch}
              onClear={handleClearSearch}
              suggestions={activeSearch ? getSuggestions() : []}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}