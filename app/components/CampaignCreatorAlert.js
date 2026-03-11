'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CampaignCreatorAlert({ campaign }) {
  const [show, setShow] = useState(false)
  const [daysLeft, setDaysLeft] = useState(null)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== campaign.created_by) return

      const today = new Date().toISOString().split('T')[0]
      const isInactive =
        campaign.status === 'inactive' ||
        campaign.status === 'draft' ||
        (campaign.status === 'active' && campaign.deadline && campaign.deadline < today)

      if (!isInactive) return

      // Calcular días restantes: inactive_since + 30 días, o deadline + 30 días si no hay inactive_since
      const inactiveSince = campaign.inactive_since
        ? new Date(campaign.inactive_since)
        : campaign.deadline
          ? new Date(campaign.deadline)
          : new Date()

      const deletionDate = new Date(inactiveSince)
      deletionDate.setDate(deletionDate.getDate() + 30)

      const now = new Date()
      const diff = Math.ceil((deletionDate - now) / (1000 * 60 * 60 * 24))
      setDaysLeft(Math.max(0, diff))
      setShow(true)
    }
    check()
  }, [campaign])

  if (!show) return null

  const urgent = daysLeft <= 7

  return (
    <div style={{
      padding: '16px 20px',
      background: urgent ? '#fff5f5' : '#fffbe6',
      border: `1px solid ${urgent ? '#fed7d7' : '#f6e05e'}`,
      borderRadius: '12px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      marginBottom: '20px',
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0 }}>{urgent ? '⚠️' : '🕐'}</span>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 700, color: urgent ? '#c53030' : '#744210', marginBottom: '4px' }}>
          Esta campaña está inactiva
        </p>
        <p style={{ fontSize: '13px', color: urgent ? '#c53030' : '#92400e', margin: 0, lineHeight: 1.55 }}>
          {daysLeft === 0
            ? 'Se eliminará hoy automáticamente. Reactívala desde el panel para conservarla.'
            : `Se eliminará en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'} si no la reactivas. Solo tú puedes ver esta campaña.`}
          {' '}
          <a href={`/dashboard/editar/${campaign.id}`} style={{ color: urgent ? '#c53030' : '#744210', fontWeight: 700, textDecoration: 'underline' }}>
            Editar campaña
          </a>
        </p>
      </div>
    </div>
  )
}