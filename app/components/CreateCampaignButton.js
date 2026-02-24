'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateCampaignButton({ mobile = false, onClose }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleClick = useCallback(() => {
    if (onClose) onClose()
    router.push(user ? '/dashboard/nueva' : '/login')
  }, [user, onClose, router])

  if (mobile) {
    return (
      <button
        onClick={handleClick}
        className="w-full px-4 py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-hover transition-colors font-medium"
      >
        Crear campaña
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
    >
      Crear campaña
    </button>
  )
}