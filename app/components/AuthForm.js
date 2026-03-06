'use client'

import { useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Modal from './Modal'

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' })
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(false)
  const turnstileRef = useRef(null)
  const router = useRouter()

  const verifyTurnstile = async (token) => {
    try {
      const res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      return data.success
    } catch { return false }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      setModal({ isOpen: true, title: 'Email enviado', message: 'Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.', type: 'success' })
      setIsForgotPassword(false)
      setEmail('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setCaptchaError(false)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        if (!turnstileToken) { setCaptchaError(true); setLoading(false); return }
        const validCaptcha = await verifyTurnstile(turnstileToken)
        if (!validCaptcha) {
          setCaptchaError(true)
          turnstileRef.current?.reset()
          setTurnstileToken(null)
          setLoading(false)
          return
        }
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al crear la cuenta')
        setModal({ isOpen: true, title: '¡Cuenta creada!', message: 'Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión.', type: 'success' })
        setIsLogin(true)
        setEmail('')
        setPassword('')
        setName('')
        setTurnstileToken(null)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = { background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e4e1da' }
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 500, color: '#1c2b22', marginBottom: '6px' }
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e4e1da', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1c2b22', background: '#f8f7f4', outline: 'none', boxSizing: 'border-box' }
  const btnPrimary = { width: '100%', padding: '12px', background: '#3a9e7a', color: 'white', border: 'none', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }
  const errorBox = { marginBottom: '16px', padding: '10px 14px', background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', fontSize: '13px' }

  // ── RECUPERAR CONTRASEÑA ──
  if (isForgotPassword) {
    return (
      <>
        <Modal isOpen={modal.isOpen} onClose={() => setModal(p => ({ ...p, isOpen: false }))} title={modal.title} message={modal.message} type={modal.type} />
        <div style={cardStyle}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '28px', fontWeight: 700, color: '#1c2b22', marginBottom: '6px' }}>
            Recuperar contraseña
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3a0', marginBottom: '28px' }}>
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          {error && <div style={errorBox}>{error}</div>}
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="tu@email.com" />
            </div>
            <button type="submit" disabled={loading} style={{ ...btnPrimary, background: loading ? '#94a3a0' : '#3a9e7a', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={() => { setIsForgotPassword(false); setError(null) }}
              style={{ fontSize: '13px', color: '#4d5e56', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              ← <span style={{ color: '#3a9e7a', fontWeight: 600 }}>Volver al inicio de sesión</span>
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── LOGIN / REGISTRO ──
  return (
    <>
      <Modal isOpen={modal.isOpen} onClose={() => setModal(p => ({ ...p, isOpen: false }))} title={modal.title} message={modal.message} type={modal.type} />

      <div style={cardStyle}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '28px', fontWeight: 700, color: '#1c2b22', marginBottom: '6px' }}>
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3a0', marginBottom: '28px' }}>
          {isLogin ? 'Accede para gestionar tus campañas' : 'Crea tu cuenta para empezar a organizar'}
        </p>

        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {!isLogin && (
            <div>
              <label style={labelStyle}>Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} style={inputStyle} placeholder="Tu nombre" />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="tu@email.com" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Contraseña</label>
              {isLogin && (
                <button type="button" onClick={() => { setIsForgotPassword(true); setError(null) }}
                  style={{ fontSize: '12px', color: '#3a9e7a', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ ...inputStyle, paddingRight: '44px' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3a0', display: 'flex', alignItems: 'center', padding: '2px' }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="turnstile-wrapper">
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => { setTurnstileToken(token); setCaptchaError(false) }}
                onError={() => { setTurnstileToken(null); setCaptchaError(true) }}
                onExpire={() => setTurnstileToken(null)}
                options={{ theme: 'light', language: 'es', size: 'flexible' }}
                style={{ width: '100%' }}
              />
              {captchaError && <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '4px' }}>Por favor, completa la verificación de seguridad.</p>}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ ...btnPrimary, background: loading ? '#94a3a0' : '#3a9e7a', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
            {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); setCaptchaError(false); setTurnstileToken(null) }}
            style={{ fontSize: '13px', color: '#4d5e56', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            {isLogin ? (
              <>¿No tienes cuenta? <span style={{ color: '#3a9e7a', fontWeight: 600 }}>Regístrate</span></>
            ) : (
              <>¿Ya tienes cuenta? <span style={{ color: '#3a9e7a', fontWeight: 600 }}>Inicia sesión</span></>
            )}
          </button>
        </div>
      </div>
    </>
  )
}