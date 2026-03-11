'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserMenu from './UserMenu'
import CreateCampaignButton from './CreateCampaignButton'

const linkStyle = {
  color: '#4d5e56', fontSize: '14px', textDecoration: 'none',
  fontWeight: 500, transition: 'color 0.15s',
}
const createLinkStyle = {
  color: '#3a9e7a', fontSize: '14px', textDecoration: 'none',
  fontWeight: 600, transition: 'color 0.15s',
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const closeMobileMenu = () => {
    setVisible(false)
    setTimeout(() => setMobileMenuOpen(false), 250)
  }

  useEffect(() => {
    if (mobileMenuOpen) {
      setTimeout(() => setVisible(true), 10)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .menu-anim { opacity: 0; animation: fadeUp 0.3s ease forwards; }
      `}</style>

      <nav style={{ background: 'white', borderBottom: '1px solid #e4e1da', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', position: 'relative' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Herdfy" style={{ width: '128px', height: '48px', objectFit: 'contain' }} loading="eager" width={128} height={48} />
            </Link>

            {/* Desktop — nav centro */}
            <div className="hidden md:flex" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', alignItems: 'center', gap: '32px' }}>
              <Link href="/" style={linkStyle}>Campañas</Link>
              <Link href="/como-funciona" style={linkStyle}>Cómo funciona</Link>
              <Link href="/faq" style={linkStyle}>FAQ</Link>
            </div>

            {/* Desktop — derecha */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
              <UserMenu />
              <CreateCampaignButton />
            </div>

            {/* Hamburguesa */}
            <button
              onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
              className="md:hidden"
              style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              aria-label="Menú"
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" fill="none" stroke="#1c2b22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="#1c2b22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed', inset: 0, zIndex: 49,
            background: '#f8f7f4',
            display: 'flex', flexDirection: 'column',
            paddingTop: '64px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 20px 32px', overflow: 'auto' }}>

            {/* Bloque usuario — nivel 1 */}
            <div className="menu-anim" style={{ animationDelay: '0.04s' }}>
              <UserMenu mobile onClose={closeMobileMenu} />
            </div>

            {/* Divisor */}
            <div className="menu-anim" style={{ animationDelay: '0.1s', height: '1px', background: '#e4e1da', margin: '20px 0' }} />

            {/* Navegación — nivel 2 */}
            <div className="menu-anim" style={{ animationDelay: '0.14s' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3a0', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', paddingLeft: '12px' }}>
                Explorar
              </p>
              <Link href="/" onClick={closeMobileMenu}
                style={{ display: 'block', padding: '13px 12px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#1c2b22', textDecoration: 'none' }}>
                Campañas
              </Link>
              <Link href="/como-funciona" onClick={closeMobileMenu}
                style={{ display: 'block', padding: '13px 12px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#1c2b22', textDecoration: 'none' }}>
                Cómo funciona
              </Link>
              <Link href="/faq" onClick={closeMobileMenu}
                style={{ display: 'block', padding: '13px 12px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#1c2b22', textDecoration: 'none' }}>
                FAQ
              </Link>
            </div>

            {/* Crear campaña — nivel 3, acción principal */}
            <div className="menu-anim" style={{ animationDelay: '0.22s', marginTop: 'auto', paddingTop: '24px' }}>
              <div style={{ height: '1px', background: '#e4e1da', marginBottom: '20px' }} />
              <Link
                href="/nueva-campana"
                onClick={closeMobileMenu}
                style={{
                  display: 'block', padding: '15px',
                  background: '#3a9e7a', color: 'white',
                  borderRadius: '100px', textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px',
                  textDecoration: 'none',
                }}
              >
                + Crear campaña
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  )
}