export const metadata = {
  title: 'Política de privacidad | Herdfy',
  robots: 'noindex'
}

export default async function Privacidad({ params }) {
  const { locale } = await params
  const isCA = locale === 'ca'

  if (isCA) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de privadesa</h1>
                <p className="text-sm text-gray-500">Darrera actualització: febrer de 2026</p>
              </div>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">1. Responsable del tractament</h2>
                <p className="text-gray-700 leading-relaxed">
                  El responsable del tractament de les dades personals recollides a través de Herdfy
                  (d'ara endavant, "el Servei") és el titular del projecte, al qual podeu contactar
                  a l'adreça de correu electrònic: <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">2. Dades que recollim</h2>
                <p className="text-gray-700 leading-relaxed">Recollim les dades següents segons l'ús que faceu del Servei:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Usuaris registrats:</strong> adreça de correu electrònic i nom (opcional), necessaris per crear i gestionar campanyes.</li>
                  <li><strong>Participants en campanyes:</strong> nom complet, DNI i localitat, introduïts voluntàriament per generar el missatge de participació. Aquestes dades es processen únicament al vostre dispositiu i no s'emmagatzemen als nostres servidors.</li>
                  <li><strong>Dades d'ús:</strong> informació sobre com interactueu amb el Servei, recollida de manera anonimitzada mitjançant PostHog.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">3. Finalitat del tractament</h2>
                <p className="text-gray-700 leading-relaxed">Tractem les vostres dades per a:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Gestionar el vostre compte i les campanyes que creeu.</li>
                  <li>Permetre-us participar en campanyes ciutadanes.</li>
                  <li>Millorar el Servei mitjançant l'anàlisi d'ús anonimitzat.</li>
                  <li>Garantir la seguretat del Servei i prevenir usos fraudulents.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">4. Base legal</h2>
                <p className="text-gray-700 leading-relaxed">
                  El tractament de les vostres dades es basa en l'execució del contracte d'ús del Servei
                  (art. 6.1.b RGPD) i en el nostre interès legítim per millorar el Servei i garantir
                  la seva seguretat (art. 6.1.f RGPD).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">5. Proveïdors de serveis (encarregats del tractament)</h2>
                <p className="text-gray-700 leading-relaxed">Per oferir el Servei fem servir els tercers següents:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Supabase</strong> — emmagatzematge de dades i autenticació. Servidors a la UE.</li>
                  <li><strong>Cloudflare</strong> — protecció contra bots (Turnstile) i distribució de contingut.</li>
                  <li><strong>Resend</strong> — enviament de correus electrònics transaccionals.</li>
                  <li><strong>PostHog</strong> — analítica d'ús anonimitzada.</li>
                  <li><strong>Vercel</strong> — allotjament de l'aplicació.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Tots aquests proveïdors actuen com a encarregats del tractament i ofereixen garanties
                  suficients d'acord amb el RGPD.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">6. Conservació de les dades</h2>
                <p className="text-gray-700 leading-relaxed">
                  Conservem les vostres dades mentre mantingueu un compte actiu al Servei. Si elimineu
                  el vostre compte, les vostres dades personals seran eliminades en un termini màxim de
                  30 dies, tret d'obligació legal de conservació.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">7. Els vostres drets</h2>
                <p className="text-gray-700 leading-relaxed">
                  En qualsevol moment podeu exercir els vostres drets d'accés, rectificació, supressió,
                  oposició, portabilitat i limitació del tractament escrivint a{' '}
                  <a href="mailto:legal@herdfy.com" className="text-primary underline">legal@herdfy.com</a>.
                  També teniu dret a presentar una reclamació davant l'
                  <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Agència Espanyola de Protecció de Dades (AEPD)
                  </a>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900">8. Canvis en aquesta política</h2>
                <p className="text-gray-700 leading-relaxed">
                  Podem actualitzar aquesta política ocasionalment. Us notificarem qualsevol canvi
                  rellevant per correu electrònic o mitjançant un avís al Servei.
                </p>
              </section>

            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
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
    </div>
  )
}
