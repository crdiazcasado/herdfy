'use client'

export default function NoResults({ searchQuery, onClear, suggestions = [] }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-12 rounded-2xl shadow-sm border-1 border-dashed border-gray-300">
      <div className="max-w-md mx-auto text-center">
        <div className="text-7xl mb-6">🔍</div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {searchQuery ? 'No encontramos campañas' : 'Aún no hay campañas activas'}
        </h3>
        
        {searchQuery ? (
          <div>
            <p className="text-gray-600 mb-6">
              No hay resultados para <span className="font-semibold text-gray-900">"{searchQuery}"</span>
            </p>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-500 font-medium">💡 Sugerencias:</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Verifica la ortografía</li>
                <li>✓ Usa palabras más generales</li>
                <li>✓ Prueba con términos diferentes</li>
              </ul>
            </div>

            <button
              onClick={onClear}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Ver todas las campañas
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              Sé el primero en crear una campaña y movilizar al rebaño
            </p>
            
            <a href="/login" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
              Crear la primera campaña
            </a>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">
              Tal vez te interesen estas campañas:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <a key={suggestion.id} href={'/c/' + suggestion.slug} className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors">
                  {suggestion.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}