import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Política de privacidad | Herdfy',
  robots: 'noindex'
}

export default function Privacidad() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de privacidad</h1>
              <p className="text-sm text-gray-500">Última actualización: febrero de 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">1. Responsable del tratamiento</h2>
              <p className="text-gray-700 leading-relaxed">
                El responsable del tratamiento de los datos personales recogidos a través de Herdfy
                (en adelante, "el Servicio") es el titular del proyecto, contactable en la dirección
                de correo electrónico: <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">2. Datos que recogemos</h2>
              <p className="text-gray-700 leading-relaxed">Recogemos los siguientes datos según el uso que hagas del Servicio:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Usuarios registrados:</strong> dirección de correo electrónico y nombre (opcional), necesarios para crear y gestionar campañas.</li>
                <li><strong>Participantes en campañas:</strong> nombre completo, DNI y localidad, introducidos voluntariamente para generar el mensaje de participación. Estos datos se procesan únicamente en tu dispositivo y no se almacenan en nuestros servidores.</li>
                <li><strong>Datos de uso:</strong> información sobre cómo interactúas con el Servicio, recogida de forma anonimizada mediante PostHog.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">3. Finalidad del tratamiento</h2>
              <p className="text-gray-700 leading-relaxed">Tratamos tus datos para:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gestionar tu cuenta y las campañas que crees.</li>
                <li>Permitirte participar en campañas ciudadanas.</li>
                <li>Mejorar el Servicio mediante análisis de uso anonimizado.</li>
                <li>Garantizar la seguridad del Servicio y prevenir usos fraudulentos.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">4. Base legal</h2>
              <p className="text-gray-700 leading-relaxed">
                El tratamiento de tus datos se basa en la ejecución del contrato de uso del Servicio
                (art. 6.1.b RGPD) y en nuestro interés legítimo para mejorar el Servicio y garantizar
                su seguridad (art. 6.1.f RGPD).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">5. Proveedores de servicios (encargados del tratamiento)</h2>
              <p className="text-gray-700 leading-relaxed">Para ofrecer el Servicio utilizamos los siguientes terceros:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Supabase</strong> — almacenamiento de datos y autenticación. Servidores en la UE.</li>
                <li><strong>Cloudflare</strong> — protección contra bots (Turnstile) y distribución de contenido.</li>
                <li><strong>Resend</strong> — envío de correos electrónicos transaccionales.</li>
                <li><strong>PostHog</strong> — analítica de uso anonimizada.</li>
                <li><strong>Vercel</strong> — alojamiento de la aplicación.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Todos estos proveedores actúan como encargados del tratamiento y ofrecen garantías
                suficientes conforme al RGPD.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">6. Conservación de los datos</h2>
              <p className="text-gray-700 leading-relaxed">
                Conservamos tus datos mientras mantengas una cuenta activa en el Servicio. Si eliminas
                tu cuenta, tus datos personales serán eliminados en un plazo máximo de 30 días, salvo
                obligación legal de conservación.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">7. Tus derechos</h2>
              <p className="text-gray-700 leading-relaxed">
                En cualquier momento puedes ejercer tus derechos de acceso, rectificación, supresión,
                oposición, portabilidad y limitación del tratamiento escribiendo a{' '}
                <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
                También tienes derecho a presentar una reclamación ante la{' '}
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  Agencia Española de Protección de Datos (AEPD)
                </a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">8. Cambios en esta política</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos actualizar esta política ocasionalmente. Te notificaremos cualquier cambio
                relevante por correo electrónico o mediante un aviso en el Servicio.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}