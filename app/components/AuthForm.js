'use client'

import { useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Modal from './Modal'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
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
    } catch {
      return false
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setCaptchaError(false)

    try {
      if (isLogin) {
        // Login: sin captcha
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')

      } else {
        // Registro: verificar captcha primero
        if (!turnstileToken) {
          setCaptchaError(true)
          setLoading(false)
          return
        }

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

        setModal({
          isOpen: true,
          title: '¡Cuenta creada!',
          message: 'Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión.',
          type: 'success'
        })

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

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isLogin
            ? 'Accede para gestionar tus campañas'
            : 'Crea tu cuenta para empezar a organizar'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Turnstile solo en registro */}
          {!isLogin && (
            <div>
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => {
                  setTurnstileToken(token)
                  setCaptchaError(false)
                }}
                onError={() => {
                  setTurnstileToken(null)
                  setCaptchaError(true)
                }}
                onExpire={() => setTurnstileToken(null)}
                options={{ theme: 'light', language: 'es', size: 'flexible' }}
                style={{ width: '100%' }}
              />
              {captchaError && (
                <p className="text-sm text-red-600 mt-1">
                  Por favor, completa la verificación de seguridad.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Cargando...'
              : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
              setCaptchaError(false)
              setTurnstileToken(null)
            }}
            className="text-sm text-gray-600"
          >
            {isLogin ? (
              <>¿No tienes cuenta?{' '}<span className="text-primary hover:underline font-medium">Regístrate</span></>
            ) : (
              <>¿Ya tienes cuenta?{' '}<span className="text-primary hover:underline font-medium">Inicia sesión</span></>
            )}
          </button>
        </div>
      </div>
    </>
  )
}