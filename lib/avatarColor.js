// Genera un color consistente basado en el nombre del usuario
// El mismo usuario siempre tendrá el mismo color

const COLORS = [
  { bg: 'bg-violet-200', text: 'text-violet-700' },
  { bg: 'bg-blue-200', text: 'text-blue-700' },
  { bg: 'bg-green-200', text: 'text-green-700' },
  { bg: 'bg-yellow-200', text: 'text-yellow-700' },
  { bg: 'bg-orange-200', text: 'text-orange-700' },
  { bg: 'bg-pink-200', text: 'text-pink-700' },
  { bg: 'bg-teal-200', text: 'text-teal-700' },
  { bg: 'bg-red-200', text: 'text-red-700' },
]

export function getAvatarColor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COLORS.length
  return COLORS[index]
}