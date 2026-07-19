import { useEffect, useReducer, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { STEPS, INITIAL_STATE, STATUS_TEXT, reducer } from './states'
import { PATIENTS, INITIAL_PADS_STATE } from './data/patients'
import { useAudio } from './hooks/useAudio'
import { useSpeech } from './hooks/useSpeech'
import { useMetronome } from './hooks/useMetronome'
import Header from './components/Header'
import AboutDea from './components/AboutDea'
import WhereToFindDea from './components/WhereToFindDea'
import HowItWorksCard from './components/HowItWorksCard'
import CprGuidePanel from './components/CprGuidePanel'
import CallEmergencyCard from './components/CallEmergencyCard'
import RecoveredCard from './components/RecoveredCard'
import ManikinBoard from './components/ManikinBoard'
import DevicePanel from './components/DevicePanel'

export function AEDSimulator() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const audioManager = useAudio()
  const speak = useSpeech()
  const playMetronomeBeep = useMetronome()
  const [padsPlaced, setPadsPlaced] = useState(INITIAL_PADS_STATE)
  const [shakePad, setShakePad] = useState(null)
  const [shockFlash, setShockFlash] = useState(false)
  const [postShockMessage, setPostShockMessage] = useState(null)
  const [compressionCount, setCompressionCount] = useState(1)
  const [patientId, setPatientId] = useState('adulto')
  const patient = PATIENTS[patientId]
  const leftDropRef = useRef(null)
  const rightDropRef = useRef(null)

  useEffect(() => {
    if (state.step !== STEPS.ANALYZING) {
      return undefined
    }

    console.log('[EFFECT ANALYZING] Iniciando análisis (5s)...')

    const timerId = setTimeout(() => {
      console.log('[EFFECT ANALYZING] ✓ Análisis completado. Resultado: SHOCK_NEEDED')
      dispatch('SHOCK_NEEDED')
    }, 5000)

    return () => clearTimeout(timerId)
  }, [state.step])

  useEffect(() => {
    if (state.step !== STEPS.CPR) {
      return undefined
    }

    playMetronomeBeep()

    const intervalId = setInterval(() => {
      playMetronomeBeep()
      setCompressionCount((prev) => (prev >= 30 ? 1 : prev + 1))
    }, 545)

    return () => clearInterval(intervalId)
  }, [playMetronomeBeep, state.step])

  useEffect(() => audioManager.playForStep(state.step), [audioManager, state.step])

  useEffect(() => {
    console.log(`[EFFECT padsPlaced] Cambio detectado:`, padsPlaced, `Estado actual: ${state.step}`)

    if (padsPlaced.left && padsPlaced.right && state.step === STEPS.PLACE_PADS) {
      console.log('[EFFECT padsPlaced] ✅ Ambos parches colocados! Disparando PADS_PLACED')
      dispatch('PADS_PLACED')
    }
  }, [padsPlaced, state.step])

  const handleDragStart = (event, padId) => {
    if (event?.dataTransfer) {
      event.dataTransfer.setData('text/plain', padId)
    }
  }

  const markPadPlaced = (padId, expectedPad) => {
    console.log(`[MARK PAD] Intentando colocar: padId=${padId}, expectedPad=${expectedPad}`)

    if (padId === expectedPad) {
      console.log(`[MARK PAD] ✅ IDs coinciden, actualizando estado`)
      setPadsPlaced((prev) => {
        const newState = { ...prev, [expectedPad]: true }
        console.log('[MARK PAD] Nuevo estado:', newState)
        return newState
      })
      setShakePad(null)
      return
    }

    console.log(`[MARK PAD] ❌ IDs no coinciden: ${padId} !== ${expectedPad}`)
    setShakePad(padId)
    setTimeout(() => setShakePad(null), 260)
  }

  const handleDrop = (event, expectedPad) => {
    if (state.step !== STEPS.PLACE_PADS) {
      return
    }

    event.preventDefault()
    if (event?.dataTransfer) {
      const draggedPad = event.dataTransfer.getData('text/plain')
      markPadPlaced(draggedPad, expectedPad)
    }
  }

  const handleDragEnd = (event, padId, expectedPad, info) => {
    console.log(`[DRAG END] padId=${padId}, expectedPad=${expectedPad}, point=${JSON.stringify(info.point)}`)

    if (state.step !== STEPS.PLACE_PADS) {
      console.log('[DRAG END] ❌ Estado incorrecto')
      return
    }

    const targetRef = expectedPad === 'left' ? leftDropRef : rightDropRef
    const targetElement = targetRef.current

    if (!targetElement) {
      console.log('[DRAG END] ❌ No hay elemento de referencia')
      return
    }

    const targetRect = targetElement.getBoundingClientRect()

    // Usa el centro del parche tal como quedó en pantalla: es inmune a
    // diferencias de scroll o zoom entre info.point y getBoundingClientRect
    const padElement = event?.target instanceof Element ? event.target.closest('.cursor-grab') : null
    let pointX
    let pointY

    if (padElement) {
      const padRect = padElement.getBoundingClientRect()
      pointX = padRect.left + padRect.width / 2
      pointY = padRect.top + padRect.height / 2
    } else {
      // Fallback: info.point viene en coordenadas de página (incluye scroll)
      pointX = info.point.x - window.scrollX
      pointY = info.point.y - window.scrollY
    }

    console.log(`[DRAG END] Target rect:`, {
      left: targetRect.left,
      right: targetRect.right,
      top: targetRect.top,
      bottom: targetRect.bottom,
      pointX,
      pointY,
    })

    const tolerance = 40
    const inX = pointX >= targetRect.left - tolerance && pointX <= targetRect.right + tolerance
    const inY = pointY >= targetRect.top - tolerance && pointY <= targetRect.bottom + tolerance

    if (inX && inY) {
      markPadPlaced(padId, expectedPad)
    } else {
      setShakePad(padId)
      setTimeout(() => setShakePad(null), 260)
    }
  }

  const handleConfirmCall = () => {
    setPadsPlaced(INITIAL_PADS_STATE)
    setShakePad(null)
    dispatch('CALL_911_DONE')
  }

  const handleShockDelivered = () => {
    setShockFlash(true)
    setPostShockMessage('Descarga administrada')
    setCompressionCount(1)

    setTimeout(() => {
      setShockFlash(false)
      setPostShockMessage(null)
      dispatch('SHOCK_DELIVERED')
    }, 260)
  }

  const handleReset = () => {
    setPadsPlaced(INITIAL_PADS_STATE)
    setShakePad(null)
    setCompressionCount(1)
    setShockFlash(false)
    dispatch('POWER_OFF')
  }

  const handleSelectPatient = (id) => {
    if (id === patientId) return
    setPatientId(id)
    handleReset()
  }

  // Effect for voice instructions
  useEffect(() => {
    if (postShockMessage) {
      speak(postShockMessage)
      return
    }

    if (!STATUS_TEXT[state.step] || state.step === STEPS.OFF) return

    const text =
      state.step === STEPS.RECOVERED
        ? `${STATUS_TEXT[state.step]}. ${patient.recoveredMsg}`
        : STATUS_TEXT[state.step]

    if (state.step === STEPS.START) {
      speak(text, { onEnd: () => dispatch('PLACE_PADS') })
      return
    }

    speak(text)
  }, [postShockMessage, state.step, speak, patient.recoveredMsg])

  const isRunning = state.step !== STEPS.OFF

  return (
    <div className="min-h-screen flex flex-col bg-cr-paper">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
        <AboutDea />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Panel izquierdo: guía */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            {state.step === STEPS.CPR ? (
              <CprGuidePanel patient={patient} />
            ) : (
              <HowItWorksCard noun={patient.noun} />
            )}
          </div>

          {/* Área central: muñeco */}
          <div className="lg:col-span-6 flex flex-col h-full">
            {state.step === STEPS.CALL_911 ? (
              <CallEmergencyCard onConfirm={handleConfirmCall} />
            ) : state.step === STEPS.RECOVERED ? (
              <RecoveredCard patient={patient} />
            ) : (
              <ManikinBoard
                patient={patient}
                patientId={patientId}
                step={state.step}
                padsPlaced={padsPlaced}
                shakePad={shakePad}
                shockFlash={shockFlash}
                leftDropRef={leftDropRef}
                rightDropRef={rightDropRef}
                onSelectPatient={handleSelectPatient}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onShock={handleShockDelivered}
              />
            )}
          </div>

          {/* Panel derecho: equipo DEA (monitor y controles) */}
          <DevicePanel
            step={state.step}
            message={postShockMessage ?? STATUS_TEXT[state.step]}
            touchWarning={patient.touchWarning}
            isRunning={isRunning}
            compressionCount={compressionCount}
            onPowerOn={() => dispatch('POWER_ON')}
            onPowerOff={() => dispatch('POWER_OFF')}
            onNextCycle={() => dispatch('CPR_COMPLETE')}
            onReset={handleReset}
          />
        </div>

        <WhereToFindDea />
      </main>

      {/* Shock discharge flash animation */}
      {shockFlash && (
        <motion.div
          className="fixed inset-0 bg-white pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.9, 0.2, 0.9, 0.1, 0] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onAnimationComplete={() => setShockFlash(false)}
        />
      )}
    </div>
  )
}

export default AEDSimulator
