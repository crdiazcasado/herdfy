
export const metadata = {
  title: 'Política de cookies | Herdfy',
  robots: 'noindex'
}

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de cookies</h1>
              <p className="text-sm text-gray-500">Última actualización: febrero de 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">1. ¿Qué son las cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
                cuando los visitas. Sirven para que el sitio funcione correctamente, recordar tus
                preferencias y recopilar información sobre cómo se usa el servicio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">2. Cookies que utilizamos</h2>

              <h3 className="text-lg font-medium text-gray-800">Cookies técnicas (necesarias)</h3>
              <p className="text-gray-700 leading-relaxed">
                Son imprescindibles para que el Servicio funcione. Sin ellas no podrías iniciar sesión
                ni crear campañas. No requieren tu consentimiento.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Cookie</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Proveedor</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Finalidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2 text-gray-700 font-mono">sb-*</td>
                      <td className="px-4 py-2 text-gray-700">Supabase</td>
                      <td className="px-4 py-2 text-gray-700">Gestión de sesión de usuario</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-700 font-mono">cf_clearance</td>
                      <td className="px-4 py-2 text-gray-700">Cloudflare</td>
                      <td className="px-4 py-2 text-gray-700">Verificación de seguridad anti-bot</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mt-4">Cookies analíticas</h3>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos PostHog para entender cómo se usa Herdfy y mejorar el Servicio.
                Los datos recogidos son anonimizados y no permiten identificarte personalmente.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Cookie</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Proveedor</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Finalidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2 text-gray-700 font-mono">ph_*</td>
                      <td className="px-4 py-2 text-gray-700">PostHog</td>
                      <td className="px-4 py-2 text-gray-700">Analítica de uso anonimizada</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">3. Cómo gestionar las cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que
                bloquear las cookies técnicas puede afectar al funcionamiento del Servicio.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary underline">Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer" className="text-primary underline">Firefox</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary underline">Safari</a></li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">4. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Para cualquier consulta sobre el uso de cookies puedes escribirnos a{' '}
                <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}