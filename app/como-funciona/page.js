export const metadata = {
  title: 'Cómo funciona · Herdfy',
  description: 'Herdfy es la plataforma donde la ciudadanía se organiza para ser escuchada. Sin burocracia, sin barreras.',
}

const sectionTitle = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontSize: '22px',
  fontWeight: 700,
  color: '#1c2b22',
  marginBottom: '20px',
}

const stepNumber = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: '#eaf5f0',
  color: '#3a9e7a',
  fontWeight: 700,
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const stepTitle = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#1c2b22',
  marginBottom: '4px',
}

const stepDesc = {
  fontSize: '15px',
  color: '#4d5e56',
  lineHeight: 1.6,
  margin: 0,
}

function Step({ n, title, description }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={stepNumber}>{n}</div>
      <div>
        <p style={stepTitle}>{title}</p>
        <p style={stepDesc}>{description}</p>
      </div>
    </div>
  )
}

export default function ComoFunciona() {
  return (
    <main style={{ background: '#f8f7f4', minHeight: '100vh', padding: '48px 16px 80px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: '#1c2b22', lineHeight: 1.2, marginBottom: '16px' }}>
            Herdfy es la plataforma donde la ciudadanía se organiza para ser escuchada.
          </h1>
          <p style={{ fontSize: '17px', color: '#4d5e56', lineHeight: 1.65 }}>
            Sin burocracia, sin barreras. Solo tú, tu mensaje y las personas que piensan como tú.
          </p>
        </div>

        {/* Participar */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e1da', padding: '28px', marginBottom: '16px' }}>
          <h2 style={sectionTitle}>Si quieres participar</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Step
              n={1}
              title="Encuentra una campaña"
              description="Busca por tema o palabra clave. Hay campañas de todo tipo: medioambiente, derechos, urbanismo, animales, educación..."
            />
            <Step
              n={2}
              title="Lee el mensaje"
              description="Cada campaña incluye un texto dirigido a quien tiene que tomar la decisión. Puedes editarlo si quieres añadir tu propia voz."
            />
            <Step
              n={3}
              title="Envía tu apoyo"
              description="Rellena tu nombre, localidad y fecha. Nosotros generamos el mensaje listo para copiar y enviar al destinatario."
            />
          </div>
        </div>

        {/* Crear */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e1da', padding: '28px', marginBottom: '16px' }}>
          <h2 style={sectionTitle}>Si quieres crear una campaña</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Step
              n={1}
              title="Crea tu cuenta"
              description="Solo necesitas un email."
            />
            <Step
              n={2}
              title="Define tu campaña"
              description="Ponle título, elige a quién va dirigida y escribe el mensaje base que los participantes podrán personalizar."
            />
            <Step
              n={3}
              title="Compártela"
              description="Cada campaña tiene su propia URL. Compártela por WhatsApp, redes o donde quieras. Herdfy hace el resto."
            />
          </div>
        </div>

        {/* Datos */}
        <div style={{ background: '#eaf5f0', borderRadius: '16px', border: '1px solid #c6e8da', padding: '24px' }}>
          <h2 style={{ ...sectionTitle, marginBottom: '10px', fontSize: '17px' }}>¿Qué pasa con tus datos?</h2>
          <p style={{ fontSize: '15px', color: '#4d5e56', lineHeight: 1.65, margin: 0 }}>
            Los datos que introduces al participar (nombre, localidad, fecha) solo se usan para generar el mensaje. Herdfy no los almacena ni los comparte con terceros.
          </p>
        </div>

      </div>
    </main>
  )
}