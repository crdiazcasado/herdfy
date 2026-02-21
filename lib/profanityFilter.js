// lib/profanityFilter.js

const BLOCKED_WORDS = [
  // Sexual explícito
  'pene', 'polla', 'verga', 'vulva', 'coño',
  'concha', 'clitoris', 'clítoris', 'chocho', 'xoxo', 'chochete',

  // Insultos fuertes
  'puta', 'puto', 'mierda', 'joder',
  'gilipollas', 'cabron', 'cabrón',
  'maricon', 'maricón', 'maricona',
  'zorra',

  // Insultos generales
  'joder', 'puta', 'puto', 'hostia',
  'gilipollas', 'capullo', 'imbecil',
  'hijo de puta', 'me cago', 'follar', 'subnormal',
  'retrasado', 'idiota', 'estupido',
  'pendejo', 'chinga', 'pinche',

  // Variaciones fuertes
  'culero', 'culiao', 'culiada',
  'malparido', 'gonorrea', 'hijueputa',
  'careputa', 'mamón', 'mamon', 'chingada', 'chingar',
  'pelotudo', 'boludo', 'forro',
  'conchetumadre', 'ctm', 'hdp'
]

const LEET_MAP = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '@': 'a'
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[0134@]/g, c => LEET_MAP[c] || c)
    .replace(/(.)\1{2,}/g, '$1') // reduce letras repetidas
}

function buildFlexibleRegex(word) {
  const letters = normalizeText(word).split('')

  const pattern = letters
    .map(letter => `${letter}+[^a-z0-9]*`)
    .join('')

  return new RegExp(pattern, 'i')
}

// Precompilamos regex para mejor rendimiento
const REGEX_LIST = BLOCKED_WORDS.map(word => ({
  word,
  regex: buildFlexibleRegex(word)
}))

export function containsProfanity(text) {
  if (!text) return false
  const normalized = normalizeText(text)

  return REGEX_LIST.some(({ regex }) => regex.test(normalized))
}

export function findProfanity(text) {
  if (!text) return []
  const normalized = normalizeText(text)

  return REGEX_LIST
    .filter(({ regex }) => regex.test(normalized))
    .map(({ word }) => word)
}