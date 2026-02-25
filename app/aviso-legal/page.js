import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Aviso legal | Herdfy',
  robots: 'noindex'
}

export default function AvisoLegal() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Aviso legal</h1>
              <p className="text-sm text-gray-500">Última actualización: febrero de 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">1. Titular del sitio web</h2>
              <p className="text-gray-700 leading-relaxed">
                El presente sitio web <strong>herdfy.com</strong> es un proyecto personal sin
                personalidad jurídica propia. Para cualquier comunicación, puedes contactar
                a través de: <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">2. Objeto y ámbito de aplicación</h2>
              <p className="text-gray-700 leading-relaxed">
                El presente aviso legal regula el acceso y uso del sitio web herdfy.com,
                de conformidad con lo establecido en la Ley 34/2002, de 11 de julio, de
                Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">3. Propiedad intelectual</h2>
              <p className="text-gray-700 leading-relaxed">
                El nombre, logotipo, diseño y código fuente de Herdfy son propiedad de su titular.
                Queda prohibida su reproducción, distribución o modificación sin autorización expresa.
              </p>
              <p className="text-gray-700 leading-relaxed">
                El contenido de las campañas (textos, imágenes) es responsabilidad exclusiva
                de los usuarios que las crean.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">4. Exclusión de responsabilidad</h2>
              <p className="text-gray-700 leading-relaxed">
                Herdfy no se responsabiliza de los daños o perjuicios que pudieran derivarse de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>El contenido publicado por los usuarios en sus campañas.</li>
                <li>Interrupciones o fallos técnicos del servicio.</li>
                <li>El uso que los participantes hagan de los mensajes generados.</li>
                <li>Accesos no autorizados derivados de vulnerabilidades fuera de nuestro control.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">5. Enlaces a terceros</h2>
              <p className="text-gray-700 leading-relaxed">
                Herdfy puede contener enlaces a sitios web de terceros. No nos hacemos responsables
                del contenido ni de las prácticas de privacidad de dichos sitios.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">6. Legislación aplicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Este aviso legal se rige por la legislación española. Cualquier controversia
                derivada del acceso o uso del sitio web se someterá a los juzgados y tribunales
                competentes conforme a la normativa vigente.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}