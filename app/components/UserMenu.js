'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const AVATAR_COLORS = {
  violet: { bg: '#ede9fe', text: '#7c3aed' },
  blue:   { bg: '#dbeafe', text: '#2563eb' },
  green:  { bg: '#dcfce7', text: '#16a34a' },
  yellow: { bg: '#fef9c3', text: '#ca8a04' },
  orange: { bg: '#ffedd5', text: '#ea580c' },
  pink:   { bg: '#fce7f3', text: '#db2777' },
  teal:   { bg: '#ccfbf1', text: '#0d9488' },
  red:    { bg: '#fee2e2', text: '#dc2626' },
}

export default function UserMenu({ mobile = false, onClose }) {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [avatarColor, setAvatarColor] = useState('violet')
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('name, avatar_color')
          .eq('id', user.id)
          .single()
        if (data?.name) setUserName(data.name)
        if (data?.avatar_color) setAvatarColor(data.avatar_color)
      }
      setLoading(false)
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

  if (loading) {
    return <div style={{ width: '96px', height: '32px', background: '#f0f0ee', borderRadius: '8px' }} />
  }

  const displayName = userName || user?.email?.split('@')[0] || 'U'
  const colors = AVATAR_COLORS[avatarColor] || AVATAR_COLORS.violet

  // ── NO LOGUEADO MÓVIL ──
  if (!user && mobile) {
    return (
      <Link href="/login" onClick={onClose}
        style={{ display: 'block', padding: '14px', background: '#3a9e7a', color: 'white', borderRadius: '100px', textAlign: 'center', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
        Iniciar sesión
      </Link>
    )
  }

  // ── NO LOGUEADO DESKTOP ──
  if (!user) {
    return (
      <Link href="/login"
        style={{ padding: '8px 20px', border: '1.5px solid #3a9e7a', color: '#3a9e7a', borderRadius: '100px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
        Iniciar sesión
      </Link>
    )
  }

  // ── LOGUEADO MÓVIL ──
  if (mobile) {
    return (
      <div>
        {/* Bloque usuario — tarjeta con fondo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'white', borderRadius: '14px', border: '1px solid #e4e1da', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', background: colors.bg, color: colors.text, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>
            {displayName[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#1c2b22', lineHeight: 1.2 }}>
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3a0', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
        </div>

        {/* Label sección */}
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3a0', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '16px 0 8px', paddingLeft: '12px' }}>
          Mi cuenta
        </p>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link href="/dashboard" onClick={onClose}
            style={{ padding: '13px 12px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#1c2b22', textDecoration: 'none', display: 'block' }}>
            Mis campañas
          </Link>
          <Link href="/perfil" onClick={onClose}
            style={{ padding: '13px 12px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#1c2b22', textDecoration: 'none', display: 'block' }}>
            Mi perfil
          </Link>
          <button onClick={handleLogout}
            style={{ padding: '13px 12px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#e53e3e', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '4px' }}>
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  }

  // ── LOGUEADO DESKTOP ──
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowMenu(!showMenu)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
        <div style={{ width: '32px', height: '32px', background: colors.bg, color: colors.text, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
          {displayName[0].toUpperCase()}
        </div>
        <span style={{ fontSize: '14px', color: '#4d5e56', fontWeight: 500 }}>{displayName}</span>
      </button>

      {showMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={handleCloseMenu} />
          <div style={{ position: 'absolute', right: 0, marginTop: '8px', width: '200px', background: 'white', border: '1px solid #e4e1da', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 20, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e4e1da' }}>
              <div style={{ fontSize: '13px', color: '#94a3a0', marginBottom: '2px' }}>Conectado como</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1c2b22', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
            <Link href="/dashboard" onClick={handleCloseMenu} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#1c2b22', textDecoration: 'none' }}>Mis campañas</Link>
            <Link href="/perfil" onClick={handleCloseMenu} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#1c2b22', textDecoration: 'none' }}>Mi perfil</Link>
            <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '10px 16px', fontSize: '14px', color: '#e53e3e', background: 'transparent', border: 'none', borderTop: '1px solid #e4e1da', cursor: 'pointer', textAlign: 'left' }}>
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  )
}