import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">

          <div className="flex items-center gap-2 text-center md:text-left">
            <div>
              <div className="font-bold text-gray-900">Herdfy</div>
              <div className="text-sm text-gray-600">¡Todos a una!</div>
            </div>
          </div>

          {/* Links legales */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <Link href="/privacidad" className="hover:text-gray-700 hover:underline">Privacidad</Link>
            <Link href="/cookies" className="hover:text-gray-700 hover:underline">Cookies</Link>
            <Link href="/terminos" className="hover:text-gray-700 hover:underline">Términos</Link>
            <Link href="/aviso-legal" className="hover:text-gray-700 hover:underline">Aviso legal</Link>
          </div>

          <div className="text-sm text-gray-600 text-center">
            2026 · Hecho con ❤️ por{' '}
            <a
              href="https://www.linkedin.com/in/crdiazcasado/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Cristina Díaz
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}