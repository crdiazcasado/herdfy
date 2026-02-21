'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function UserMenu({ mobile = false, onClose }) {
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowMenu(false)
    if (onClose) onClose()
    router.push('/')
    router.refresh()
  }

  // --- NO LOGUEADO ---
  if (!user) {
    if (mobile) {
      return (
        <a
          href="/login"
          className="block px-4 py-3 text-center border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
          onClick={onClose}
        >
          Iniciar sesión
        </a>
      )
    }
    return (
      <a
        href="/login"
        className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
        onClick={onClose}
      >
        Iniciar sesión
      </a>
    )
  }

  // --- MOBILE LOGUEADO ---
  if (mobile) {
    return (
      <div className="space-y-2">
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Conectado como</p>
          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
        </div>

        <a
          href="/dashboard"
          className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-primary rounded-lg transition-colors font-medium"
          onClick={onClose}
        >
          📊 Mis campañas
        </a>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium border-t border-gray-100"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    )
  }

  // --- DESKTOP LOGUEADO ---
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
          {user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="text-gray-700 hidden md:block">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {showMenu && (
        <div>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">Conectado como</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>

            <button
              onClick={() => { setShowMenu(false); router.push('/dashboard') }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              📊 Mis campañas
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
