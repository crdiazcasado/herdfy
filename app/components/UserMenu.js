'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { getAvatarColor } from '../../lib/avatarColor'

export default function UserMenu({ mobile = false, onClose }) {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('users').select('name').eq('id', user.id).single()
        if (data?.name) setUserName(data.name)
      }
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    setShowMenu(false)
    if (onClose) onClose()
    router.push('/')
    router.refresh()
  }, [onClose, router])

  const handleCloseMenu = useCallback(() => setShowMenu(false), [])

  // --- NO LOGUEADO ---
  if (!user) {
    if (mobile) {
      return (
        <Link
          href="/login"
          className="block px-4 py-3 text-center border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
          onClick={onClose}
        >
          Iniciar sesión
        </Link>
      )
    }
    return (
      <Link
        href="/login"
        className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
        onClick={onClose}
      >
        Iniciar sesión
      </Link>
    )
  }

  const displayName = userName || user.email?.split('@')[0] || 'U'
  const avatarColor = getAvatarColor(displayName)

  // --- MOBILE LOGUEADO ---
  if (mobile) {
    return (
      <div className="space-y-2">
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Conectado como</p>
          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
        </div>
        <Link
          href="/dashboard"
          className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-primary rounded-lg transition-colors font-medium"
          onClick={onClose}
        >
          📊 Mis campañas
        </Link>
        <Link
          href="/perfil"
          className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-primary rounded-lg transition-colors font-medium"
          onClick={onClose}
        >
          👤 Mi perfil
        </Link>
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
        <div className={`w-8 h-8 ${avatarColor.bg} ${avatarColor.text} rounded-full flex items-center justify-center font-medium`}>
          {displayName[0].toUpperCase()}
        </div>
        <span className="text-gray-700 hidden md:block">
          {displayName}
        </span>
      </button>

      {showMenu && (
        <div>
          <div className="fixed inset-0 z-10" onClick={handleCloseMenu} />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">Conectado como</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleCloseMenu}
            >
              📊 Mis campañas
            </Link>
            <Link
              href="/perfil"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleCloseMenu}
            >
              👤 Mi perfil
            </Link>
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