import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Términos y condiciones | Herdfy',
  robots: 'noindex'
}

export default function Terminos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y condiciones</h1>
              <p className="text-sm text-gray-500">Última actualización: febrero de 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">1. Qué es Herdfy</h2>
              <p className="text-gray-700 leading-relaxed">
                Herdfy es una plataforma que permite a cualquier persona crear y difundir campañas
                ciudadanas para enviar mensajes colectivos a organismos públicos o privados. El uso
                del Servicio implica la aceptación de estos términos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">2. Registro y cuenta</h2>
              <p className="text-gray-700 leading-relaxed">
                Para crear campañas necesitas registrarte con una dirección de email válida. Eres
                responsable de mantener la confidencialidad de tu cuenta y de todas las actividades
                que se realicen desde ella.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">3. Uso aceptable</h2>
              <p className="text-gray-700 leading-relaxed">Al usar Herdfy te comprometes a:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Crear únicamente campañas con contenido veraz y legítimo.</li>
                <li>No usar el Servicio para difundir contenido ilegal, difamatorio, discriminatorio o que incite al odio.</li>
                <li>No suplantar la identidad de personas u organismos.</li>
                <li>No usar el Servicio para enviar spam o comunicaciones no solicitadas de forma masiva.</li>
                <li>Respetar los derechos de propiedad intelectual de terceros.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">4. Contenido de las campañas</h2>
              <p className="text-gray-700 leading-relaxed">
                El creador de cada campaña es el único responsable de su contenido. Herdfy no
                verifica ni respalda el contenido de las campañas creadas por los usuarios.
                Nos reservamos el derecho de eliminar cualquier campaña que incumpla estos términos
                o la legislación vigente.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">5. Participación en campañas</h2>
              <p className="text-gray-700 leading-relaxed">
                Al participar en una campaña, generas un mensaje que se envía desde tu propio cliente
                de correo electrónico. Herdfy actúa únicamente como herramienta para facilitar
                la generación de ese mensaje y no es responsable del contenido final enviado
                ni de sus consecuencias.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">6. Disponibilidad del servicio</h2>
              <p className="text-gray-700 leading-relaxed">
                Herdfy se ofrece "tal cual" y no garantizamos disponibilidad ininterrumpida.
                Podemos modificar, suspender o interrumpir el Servicio en cualquier momento,
                con o sin previo aviso.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">7. Limitación de responsabilidad</h2>
              <p className="text-gray-700 leading-relaxed">
                En la máxima medida permitida por la ley, Herdfy no será responsable de ningún
                daño indirecto, incidental o consecuente derivado del uso o la imposibilidad
                de uso del Servicio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">8. Modificaciones</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos actualizar estos términos en cualquier momento. Si los cambios son
                significativos, te lo comunicaremos por correo electrónico. El uso continuado
                del Servicio tras la publicación de los cambios implica su aceptación.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">9. Legislación aplicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Estos términos se rigen por la legislación española. Para cualquier disputa,
                las partes se someten a los juzgados y tribunales competentes según la normativa
                española vigente.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">10. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Para cualquier consulta sobre estos términos puedes escribirnos a{' '}
                <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}