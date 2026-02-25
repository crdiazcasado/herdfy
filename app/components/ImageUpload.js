'use client'

import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

export default function ImageUpload({ currentImageUrl, onImageUploaded, error = false }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImageUrl || null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB')
      return
    }

    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(fileName)

      setPreview(data.publicUrl)
      onImageUploaded(data.publicUrl)
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Imagen de portada"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 px-3 py-1 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 shadow"
          >
            {uploading ? 'Subiendo...' : '✏️ Cambiar imagen'}
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`w-full h-36 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-green-50 transition-colors ${
              error
                ? 'border-red-400 bg-red-50 hover:border-red-500'
                : 'border-gray-300 hover:border-primary'
            }`}
          >
            <span className="text-3xl">🖼️</span>
            <span className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-600'}`}>
              {uploading ? 'Subiendo...' : 'Añadir imagen de portada'}
            </span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP · Máx. 5MB</span>
          </button>
          {error && (
            <p className="text-sm text-red-600 mt-1">La imagen de portada es obligatoria</p>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}