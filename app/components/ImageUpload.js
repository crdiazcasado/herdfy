'use client'

import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const MAX_INPUT_BYTES = 20 * 1024 * 1024 // 20 MB — limit before compression
const MAX_WIDTH = 1200

function compressToWebP(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Conversion failed')); return }
          resolve(new File([blob], 'image.webp', { type: 'image/webp' }))
        },
        'image/webp',
        0.82
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Load failed')) }
    img.src = url
  })
}

export default function ImageUpload({ currentImageUrl, onImageUploaded, error = false }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImageUrl || null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WebP, HEIC...)')
      return
    }
    if (file.size > MAX_INPUT_BYTES) {
      alert('La imagen no puede superar los 20MB')
      return
    }

    setUploading(true)

    try {
      const compressed = await compressToWebP(file)

      const { data: { user } } = await supabase.auth.getUser()
      const fileName = `${user.id}/${Date.now()}.webp`

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, compressed, { upsert: true, contentType: 'image/webp' })

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
            {uploading ? 'Procesando...' : '✏️ Cambiar imagen'}
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
              {uploading ? 'Procesando...' : 'Añadir imagen de portada'}
            </span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP · Se comprime automáticamente</span>
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
        className="hidden outline-none"
        onChange={handleFileChange}
      />
    </div>
  )
}
