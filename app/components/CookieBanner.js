'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('herdfy_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('herdfy_cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('herdfy_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 text-sm text-gray-700 leading-relaxed">
          <span className="mr-1">🍪</span>
          Usamos cookies propias para el funcionamiento del servicio y cookies analíticas
          (PostHog) para mejorar tu experiencia. Puedes aceptarlas o rechazarlas.{' '}
          <Link href="/cookies" className="text-primary underline hover:no-underline">
            Más información
          </Link>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}