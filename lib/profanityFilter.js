// lib/profanityFilter.js

const BLOCKED_WORDS = [
  // Sexual explícito
  'pene', 'polla', 'verga', 'vulva', 'cono',
  'concha', 'clitoris', 'chocho', 'chochete',
  // Insultos fuertes
  'puta', 'puto', 'mierda', 'joder',
  'gilipollas', 'cabron',
  'maricon', 'maricona',
  'zorra',
  // Insultos generales
  'hostia', 'capullo', 'imbecil',
  'hijo de puta', 'me cago', 'follar', 'subnormal',
  'retrasado', 'idiota', 'estupido',
  'pendejo', 'chinga', 'pinche',
  // Variaciones fuertes
  'culero', 'culiao', 'culiada',
  'malparido', 'gonorrea', 'hijueputa',
  'careputa', 'mamon', 'chingada', 'chingar',
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
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .replace(/[0134@]/g, c => LEET_MAP[c] || c) // leet speak
    .replace(/(.)\1{2,}/g, '$1') // reduce letras repetidas (hooola → hola)
}

function buildWordRegex(word) {
  const normalized = normalizeText(word)
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Límite de palabra: no precedido ni seguido de otra letra
  return new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i')
}

const REGEX_LIST = BLOCKED_WORDS.map(word => ({
  word,
  regex: buildWordRegex(word)
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