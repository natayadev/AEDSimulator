import { useCallback, useEffect, useRef } from 'react'

// Voces femeninas en español conocidas, en orden de preferencia
const FEMALE_VOICE_PRIORITY = [
  'sabina', // Windows es-MX
  'helena', // Windows es-ES
  'laura', // Windows es-ES
  'google español', // Chrome
  'paulina', // macOS es-MX
  'mónica', // macOS es-ES
  'monica',
  'lucía',
  'lucia',
  'elvira',
  'female',
]

// Voces masculinas conocidas, para evitarlas en el fallback
const MALE_VOICE_HINTS = ['raul', 'raúl', 'pablo', 'jorge', 'diego', 'juan', 'male']

function pickSpanishFemaleVoice() {
  const voices = window.speechSynthesis.getVoices()
  const spanish = voices.filter((voice) => voice.lang.toLowerCase().startsWith('es'))

  if (spanish.length === 0) return null

  for (const hint of FEMALE_VOICE_PRIORITY) {
    const match = spanish.find((voice) => voice.name.toLowerCase().includes(hint))
    if (match) return match
  }

  // Fallback: cualquier voz en español que no sea una masculina conocida
  const notMale = spanish.find(
    (voice) => !MALE_VOICE_HINTS.some((hint) => voice.name.toLowerCase().includes(hint)),
  )
  return notMale ?? spanish[0]
}

/**
 * Sintetiza voz en español (femenina y estable entre sesiones) usando la Web Speech API.
 * Acepta options.onEnd para encadenar acciones al terminar la locución.
 */
export function useSpeech() {
  const voiceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined

    const updateVoice = () => {
      voiceRef.current = pickSpanishFemaleVoice()
    }

    // La lista de voces carga de forma asíncrona en algunos navegadores
    updateVoice()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoice)

    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoice)
  }, [])

  const speak = useCallback((text, options = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    // Cancela cualquier locución en curso
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceRef.current?.lang ?? 'es-ES'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    if (voiceRef.current) {
      utterance.voice = voiceRef.current
    }
    if (options.onEnd) {
      utterance.onend = options.onEnd
    }
    window.speechSynthesis.speak(utterance)
  }, [])

  return speak
}
