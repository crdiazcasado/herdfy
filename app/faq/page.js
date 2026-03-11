'use client'
import { useState } from 'react'

const faqs = [
  {
    q: '¿Herdfy es gratuito?',
    a: 'Sí, completamente. Tanto participar en campañas como crearlas es gratis.',
  },
  {
    q: '¿Necesito registrarme para participar?',
    a: 'No. Puedes participar en cualquier campaña sin crear cuenta.',
  },
  {
    q: '¿Necesito cuenta para crear una campaña?',
    a: 'Sí. Para crear y gestionar campañas necesitas registrarte con tu email.',
  },
  {
    q: '¿Quién recibe los mensajes?',
    a: 'El destinatario lo decide quien crea la campaña. Puede ser una administración, una empresa, un organismo público... El mensaje se genera listo para que cada participante lo envíe directamente.',
  },
  {
    q: '¿Cómo sé que mi participación cuenta?',
    a: 'Herdfy registra el número de participaciones en cada campaña, visible públicamente. Cuantas más personas participen, más peso tiene el mensaje colectivo.',
  },
  {
    q: '¿Puedo eliminar mi campaña?',
    a: 'Sí. Desde tu panel puedes pausarla, editarla o eliminarla cuando quieras.',
  },
  {
    q: '¿Herdfy toma partido por alguna causa?',
    a: 'No. Herdfy es una herramienta neutral. Cualquier persona u organización puede crear una campaña sobre cualquier causa, siempre dentro de la legalidad.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid #e4e1da' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '16px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#1c2b22', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: '24px', height: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', background: open ? '#3a9e7a' : '#f0f0ee',
          color: open ? 'white' : '#4d5e56',
          fontSize: '16px', fontWeight: 400,
          transition: 'background 0.2s, color 0.2s',
        }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p style={{ fontSize: '15px', color: '#4d5e56', lineHeight: 1.65, margin: '0 0 20px', paddingRight: '40px' }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <main style={{ background: '#f8f7f4', minHeight: '100vh', padding: '48px 16px 80px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: '#1c2b22', lineHeight: 1.2, marginBottom: '12px' }}>
            Preguntas frecuentes
          </h1>
          <p style={{ fontSize: '17px', color: '#4d5e56', lineHeight: 1.65 }}>
            Todo lo que necesitas saber para participar o crear tu primera campaña.
          </p>
        </div>

        {/* Acordeón */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e1da', padding: '0 24px' }}>
          {faqs.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

      </div>
    </main>
  )
}