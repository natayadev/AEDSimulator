import { useCallback, useMemo } from 'react'

/**
 * useAudio Hook
 * Uses Web Speech API as a fallback since files are currently empty/placeholders.
 */
export function useAudio() {
  const stopCurrent = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const playForStep = useCallback((step) => {
    // Logic handled directly in App.jsx via speak function for now to ensure consistency,
    // but this hook could be used to encapsulate it later if needed.
    console.log(`[useAudio] Step change detected: ${step}`)
  }, [])

  // Identidad estable para poder usarlo como dependencia de efectos
  return useMemo(() => ({ playForStep, stopCurrent }), [playForStep, stopCurrent])
}
