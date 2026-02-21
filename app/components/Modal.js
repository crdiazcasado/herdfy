'use client'

export default function Modal({ isOpen, onClose, title, message, type = 'success' }) {
  if (!isOpen) return null

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }
  
  const colors = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${colors[type]}`}>
          <span className="text-3xl">{icons[type]}</span>
        </div>

        {title && (
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>
        )}

        <p className="text-gray-600 text-center mb-6">{message}</p>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
