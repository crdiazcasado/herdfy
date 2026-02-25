'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getAvatarColor } from '../../lib/avatarColor'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingName, setLoadingName] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [errorName, setErrorName] = useState(null)
  const [errorPassword, setErrorPassword] = useState(null)
  const [successName, setSuccessName] = useState(false)
  const [successPassword, setSuccessPassword] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single()
      if (data?.name) setName(data.name)
    }
    getUser()
  }, [router])

  const handleUpdateName = async (e) => {
    e.preventDefault()
    setLoadingName(true)
    setErrorName(null)
    setSuccessName(false)

    try {
      const { error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)
      if (error) throw error
      setSuccessName(true)
      setTimeout(() => setSuccessName(false), 3000)
    } catch (err) {
      setErrorName(err.message)
    } finally {
      setLoadingName(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setErrorPassword(null)
    setSuccessPassword(false)

    if (newPassword !== confirmPassword) {
      setErrorPassword('Las contraseñas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      setErrorPassword('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoadingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setSuccessPassword(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccessPassword(false), 3000)
    } catch (err) {
      setErrorPassword(err.message)
    } finally {
      setLoadingPassword(false)
    }
  }

  if (!user) return null

  const displayName = name || user.email?.split('@')[0] || 'Usuario'
  const avatarColor = getAvatarColor(displayName)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-16 h-16 ${avatarColor.bg} ${avatarColor.text} rounded-full flex items-center justify-center text-2xl font-bold`}>
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6">

            {/* Cambiar nombre */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nombre de usuario</h2>
              {errorName && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorName}</div>
              )}
              {successName && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ Nombre actualizado</div>
              )}
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingName}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50"
                >
                  {loadingName ? 'Guardando...' : 'Guardar nombre'}
                </button>
              </form>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cambiar contraseña</h2>
              {errorPassword && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorPassword}</div>
              )}
              {successPassword && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ Contraseña actualizada</div>
              )}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50"
                >
                  {loadingPassword ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}