'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'


export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
            <p className="text-gray-600 mb-8">Introduce tu nueva contraseña.</p>

            {success ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                ✅ Contraseña actualizada. Redirigiendo al login...
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-nonefocus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-nonefocus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar contraseña'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}