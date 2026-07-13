import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Baby, CheckCircle2, HeartPulse, PersonStanding, PhoneCall, Power, RotateCcw, User, Zap } from 'lucide-react'
import { STEPS, INITIAL_STATE, reducer } from './states'
import { useAudio } from './AudioManager'
import VisualDisplay from './VisualDisplay'
import adultoImg from './assets/adulto.png'
import infanteImg from './assets/infante.png'
import bebeImg from './assets/bebe.png'
import deaImg from './assets/dea.png'
import aedSignImg from './assets/aed.png'
import posicionLateralImg from './assets/posicion-lateral.png'
import rcpAdultoImg from './assets/rcp-adulto.png'
import rcpInfanteImg from './assets/rcp-infante.png'
import rcpBebeImg from './assets/rcp-bebe.png'

const INITIAL_PADS_STATE = {
  left: false,
  right: false,
}

const PATIENTS = {
  adulto: {
    label: 'Adulto',
    noun: 'la persona',
    icon: User,
    img: adultoImg,
    alt: 'Muñeco de entrenamiento adulto',
    touchWarning: 'No tocar a la persona',
    recoveredMsg:
      'Colocá a la persona en posición lateral de seguridad y esperá a los servicios de emergencia.',
    zoneSize: 'w-16 h-16 sm:w-20 sm:h-20',
    zones: {
      left: { label: 'Esternón', x: '37%', y: '58%' },
      right: { label: 'Axila', x: '65%', y: '70%' },
    },
    cprImg: rcpAdultoImg,
    cprGuide: [
      ['Manos', 'talón de una mano en el centro del pecho, la otra encima y dedos entrecruzados.'],
      ['Frecuencia', '100 a 120 por minuto.'],
      ['Profundidad', '5 a 6 cm, fuerte y rápido.'],
      ['Ritmo', 'igual tiempo de compresión que de relajación; no interrumpas más de 10 segundos.'],
    ],
    source: 'Manual de Primeros Auxilios (30 hs) — Cruz Roja Argentina',
  },
  infante: {
    label: 'Infante',
    noun: 'el infante',
    icon: PersonStanding,
    img: infanteImg,
    alt: 'Muñeco de entrenamiento infante',
    touchWarning: 'No tocar a la persona',
    recoveredMsg:
      'Colocá al infante en posición lateral de seguridad y esperá a los servicios de emergencia.',
    zoneSize: 'w-14 h-14 sm:w-16 sm:h-16',
    zones: {
      left: { label: 'Esternón', x: '38%', y: '60%' },
      right: { label: 'Axila', x: '64%', y: '71%' },
    },
    cprImg: rcpInfanteImg,
    cprGuide: [
      ['Manos', 'una sola mano en el centro del pecho; la otra en la frente para sostener la cabeza.'],
      ['Insuflaciones', 'realizá 2 insuflaciones de rescate (boca a boca), como si fueras a inflar un globo.'],
      ['Frecuencia', '100 a 120 por minuto.'],
      ['Ritmo', 'igual tiempo de compresión que de relajación.'],
    ],
    source: 'Manual de Primeros Auxilios (30 hs) — Cruz Roja Argentina',
  },
  bebe: {
    label: 'Bebé',
    noun: 'el bebé',
    icon: Baby,
    img: bebeImg,
    alt: 'Muñeco de entrenamiento bebé',
    touchWarning: 'No tocar a la persona',
    recoveredMsg:
      'Colocá al bebé en posición lateral de seguridad, mantenelo abrigado y esperá a los servicios de emergencia.',
    zoneSize: 'w-12 h-12 sm:w-14 sm:h-14',
    zones: {
      left: { label: 'Pecho', x: '49%', y: '36%' },
      right: { label: 'Costado', x: '63%', y: '44%' },
    },
    cprImg: rcpBebeImg,
    cprGuide: [
      ['Manos', 'dos dedos en el centro del pecho y una mano en la frente para sostener la cabeza.'],
      ['Insuflaciones', 'realizá 2 insuflaciones de rescate (boca a boca), como si soplaras una vela.'],
      ['Frecuencia', '100 a 120 por minuto.'],
      ['Ritmo', 'igual tiempo de compresión que de relajación.'],
    ],
    source: 'Manual de Primeros Auxilios (30 hs) — Cruz Roja Argentina',
  },
}

export function AEDSimulator() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const audioManager = useAudio()
  const [padsPlaced, setPadsPlaced] = useState(INITIAL_PADS_STATE)
  const [shakePad, setShakePad] = useState(null)
  const [shockFlash, setShockFlash] = useState(false)
  const [postShockMessage, setPostShockMessage] = useState(null)
  const [compressionCount, setCompressionCount] = useState(1)
  const [patientId, setPatientId] = useState('adulto')
  const patient = PATIENTS[patientId]
  const leftDropRef = useRef(null)
  const rightDropRef = useRef(null)
  const audioContextRef = useRef(null)

  const speak = useCallback((text, options = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    if (options.onEnd) {
      utterance.onend = options.onEnd
    }
    window.speechSynthesis.speak(utterance)
  }, [])

  const playMetronomeBeep = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext

    if (!AudioContextClass) {
      console.log('[DEA CPR] beep 110bpm')
      return
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    const context = audioContextRef.current

    if (context.state === 'suspended') {
      context.resume()
    }

    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'square'
    oscillator.frequency.value = 880

    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08)

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start()
    oscillator.stop(context.currentTime + 0.1)
  }, [])

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

    setCompressionCount(1)
    playMetronomeBeep()

    const intervalId = setInterval(() => {
      playMetronomeBeep()
      setCompressionCount((prev) => (prev >= 30 ? 1 : prev + 1))
    }, 545)

    return () => clearInterval(intervalId)
  }, [playMetronomeBeep, state.step])

  useEffect(() => audioManager.playForStep(state.step), [state.step])

  useEffect(() => {
    if (state.step === STEPS.START) {
      setPadsPlaced(INITIAL_PADS_STATE)
      setShakePad(null)
    }
  }, [state.step])

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

  const handleShockDelivered = () => {
    setShockFlash(true)
    setPostShockMessage('Descarga administrada')

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

  const statusText = {
    [STEPS.OFF]: 'DEA apagado',
    [STEPS.CALL_911]: 'Activá el sistema de emergencias antes de continuar.',
    [STEPS.START]: 'Quita la ropa del pecho de la persona.',
    [STEPS.PLACE_PADS]: 'Coloque parches',
    [STEPS.ANALYZING]: 'Evaluando la frecuencia cardiaca',
    [STEPS.SHOCK_ADVISED]: '¡Descarga recomendada!',
    [STEPS.CPR]: 'Inicie RCP por 2 minutos',
    [STEPS.RECOVERED]: 'Pulso detectado',
  }

  // Effect for voice instructions
  useEffect(() => {
    if (postShockMessage) {
      speak(postShockMessage)
      return
    }

    if (!statusText[state.step] || state.step === STEPS.OFF) return

    const text =
      state.step === STEPS.RECOVERED
        ? `${statusText[state.step]}. ${patient.recoveredMsg}`
        : statusText[state.step]

    if (state.step === STEPS.START) {
      speak(text, { onEnd: () => dispatch('PLACE_PADS') })
      return
    }

    speak(text)
  }, [postShockMessage, state.step, speak])

  const isRunning = state.step !== STEPS.OFF

  return (
    <div className="min-h-screen flex flex-col bg-cr-paper">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartPulse size={30} className="text-cr-red" aria-hidden="true" />
            <p className="font-condensed font-bold uppercase text-cr-ink text-lg tracking-wide">
              Simulador <span className="text-cr-red">DEA</span>
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Contexto: qué es el DEA */}
        <section className="bg-white rounded border border-slate-200 shadow-sm p-5">
          <h2 className="font-condensed font-bold uppercase tracking-wide text-cr-ink pb-2 mb-3 border-b-2 border-cr-red inline-block">
            📌 ¿Qué es el DEA?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            El DEA (Desfibrilador Externo Automático) es un dispositivo electrónico portátil que
            diagnostica y puede ayudar a restablecer el ritmo cardíaco cuando una persona sufre un
            paro cardíaco. La desfibrilación consiste en emitir un impulso de corriente continua al
            corazón, para tratar que el mismo retome su ritmo normal.
          </p>
          <p className="mt-3 text-[11px] text-slate-400">
            Fuente:{' '}
            <a
              href="https://www.argentina.gob.ar/salud/primerosauxilios/rcp/desfibrilador"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-cr-red"
            >
              Ministerio de Salud — argentina.gob.ar
            </a>
          </p>
        </section>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Panel izquierdo: Guía de RCP (bloque teal) */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            {state.step === STEPS.CPR ? (
              <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-cr-teal text-white rounded shadow-sm p-5 h-full flex flex-col"
              >
                <h3 className="font-condensed font-bold uppercase tracking-wide pb-2 mb-4 border-b-2 border-white/40">
                  📌 Compresiones: {patient.label}
                </h3>
                <img
                  src={patient.cprImg}
                  alt={`Técnica de compresiones en ${patient.label.toLowerCase()}`}
                  className="w-[58%] mx-auto mb-4"
                  draggable={false}
                />
                <ul className="text-sm space-y-3 leading-relaxed">
                  {patient.cprGuide.map(([term, text]) => (
                    <li key={term}>
                      <strong>{term}:</strong> {text}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 pt-3 border-t border-white/30 text-[11px] text-white/80 leading-snug">
                  Fuente: {patient.source}
                </p>
              </motion.aside>
            ) : (
              <aside className="bg-white rounded border border-slate-200 shadow-sm p-5 h-full flex flex-col">
                <h3 className="font-condensed font-bold uppercase tracking-wide text-cr-ink pb-2 mb-4 border-b-2 border-cr-red inline-block">
                  📌 ¿Cómo funciona?
                </h3>
                <ol className="text-sm space-y-3 text-slate-600 leading-relaxed list-decimal list-inside">
                  <li>Verificá que {patient.noun} no responda y no respire.</li>
                  <li>Llamá a emergencias (107 / 911).</li>
                  <li>Encendé el DEA: idealmente mientras alguien hace RCP, otro prepara el DEA.</li>
                  <li>Quitale la ropa del torso: el pecho debe quedar descubierto y seco.</li>
                  <li>Colocá los parches sobre {patient.noun}.</li>
                  <li>Seguí las indicaciones del equipo.</li>
                </ol>
              </aside>
            )}
          </div>

          {/* Área central: muñeco */}
          <div className="lg:col-span-4 flex flex-col h-full">
            {state.step === STEPS.CALL_911 ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center gap-6 h-full"
              >
                <div className="w-20 h-20 bg-cr-red/10 rounded-full flex items-center justify-center text-cr-red animate-pulse">
                  <PhoneCall size={36} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-condensed font-bold uppercase text-cr-ink">
                    ¿Llamaste a emergencias?
                  </h2>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
                    Activá el sistema de emergencias (107 / 911) antes de continuar con la simulación.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full max-w-xs py-4 rounded-sm bg-cr-red text-white font-condensed font-bold text-lg uppercase tracking-widest hover:bg-cr-red-dark transition-all shadow-md active:scale-95"
                  onClick={() => dispatch('CALL_911_DONE')}
                >
                  Sí, ya llamé
                </button>
              </motion.div>
            ) : state.step === STEPS.RECOVERED ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-cr-teal text-white rounded shadow-sm p-8 flex flex-col items-center justify-center text-center gap-6 h-full"
              >
                <motion.div
                  className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-condensed font-bold uppercase">
                    ¡Pulso detectado!
                  </h2>
                  <p className="text-white/90 text-sm max-w-sm mx-auto">{patient.recoveredMsg}</p>
                </div>
                <img
                  src={posicionLateralImg}
                  alt="Posición lateral de seguridad"
                  className="w-full max-w-[300px]"
                  draggable={false}
                />
              </motion.div>
            ) : (
              <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-condensed font-bold uppercase tracking-wide text-cr-ink pb-2 border-b-2 border-cr-red inline-block">
                    📌 Elegí a quién asistir
                  </h3>
                  <div className="flex gap-1.5">
                    {Object.entries(PATIENTS).map(([id, p]) => {
                      const Icon = p.icon
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSelectPatient(id)}
                          className={`px-3 py-1.5 rounded-sm font-condensed font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                            patientId === id
                              ? 'bg-cr-red text-white shadow-sm'
                              : 'border border-slate-300 text-slate-500 hover:border-cr-red hover:text-cr-red'
                          }`}
                        >
                          <Icon size={14} />
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="relative mx-auto my-4 w-full max-w-[300px] select-none flex-1 flex items-center justify-center">
                  <img
                    src={patient.img}
                    alt={patient.alt}
                    className="w-full pointer-events-none my-4"
                    draggable={false}
                  />

                  {Object.entries(patient.zones).map(([zoneId, zone]) => (
                    <div
                      key={`${patientId}-${zoneId}`}
                      ref={zoneId === 'left' ? leftDropRef : rightDropRef}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 ${patient.zoneSize} rounded-full border-4 border-dashed transition-all ${
                        padsPlaced[zoneId]
                          ? 'border-cr-teal bg-cr-teal/40 scale-105 shadow-lg'
                          : 'border-cr-red/50 bg-cr-red/5'
                      }`}
                      style={{ left: zone.x, top: zone.y }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => handleDrop(event, zoneId)}
                    >
                      {!padsPlaced[zoneId] && state.step === STEPS.PLACE_PADS && (
                        <span
                          className={`absolute ${zoneId === 'left' ? '-top-5' : '-bottom-5'} left-1/2 -translate-x-1/2 text-[10px] font-condensed font-bold uppercase tracking-widest text-cr-red/70 whitespace-nowrap`}
                        >
                          {zone.label}
                        </span>
                      )}
                    </div>
                  ))}

                  {state.step === STEPS.SHOCK_ADVISED && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <motion.button
                        type="button"
                        className={`pointer-events-auto w-full max-w-[340px] py-6 rounded text-white font-condensed font-bold text-2xl uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 ${
                          shockFlash ? 'bg-cr-red/60' : 'bg-cr-red'
                        }`}
                        animate={{
                          scale: [1, 1.04, 1],
                          filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)'],
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        onClick={handleShockDelivered}
                      >
                        <Zap size={26} />
                        Shock
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Bandeja de parches */}
                {state.step === STEPS.PLACE_PADS && (!padsPlaced.left || !padsPlaced.right) && (
                  <div className="border-t border-slate-200 bg-cr-paper px-5 py-3">
                    <p className="text-[11px] font-condensed font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Arrastrá los parches hasta las zonas marcadas
                    </p>
                    <div className="flex gap-4">
                      {!padsPlaced.left && (
                        <motion.div
                          drag
                          dragMomentum={false}
                          dragSnapToOrigin
                          className="w-16 h-16 rounded bg-cr-red border-2 border-white text-white text-[10px] font-condensed font-bold uppercase flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing shadow-md z-20 relative"
                          onDragStart={(event) => handleDragStart(event, 'left')}
                          onDragEnd={(event, info) => handleDragEnd(event, 'left', 'left', info)}
                          animate={shakePad === 'left' ? { x: [-10, 10, -10, 10, 0] } : {}}
                        >
                          <span className="opacity-75">Parche</span>
                          <span>{patient.zones.left.label}</span>
                        </motion.div>
                      )}
                      {!padsPlaced.right && (
                        <motion.div
                          drag
                          dragMomentum={false}
                          dragSnapToOrigin
                          className="w-16 h-16 rounded bg-white border-2 border-cr-red text-cr-red text-[10px] font-condensed font-bold uppercase flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing shadow-md z-20 relative"
                          onDragStart={(event) => handleDragStart(event, 'right')}
                          onDragEnd={(event, info) => handleDragEnd(event, 'right', 'right', info)}
                          animate={shakePad === 'right' ? { x: [-10, 10, -10, 10, 0] } : {}}
                        >
                          <span className="opacity-75">Parche</span>
                          <span>{patient.zones.right.label}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Panel derecho: equipo DEA (monitor y controles) */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            <VisualDisplay
              step={state.step}
              message={postShockMessage ?? statusText[state.step]}
              touchWarning={patient.touchWarning}
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="py-3 rounded-sm bg-cr-red text-white font-condensed font-bold text-xs uppercase tracking-widest hover:bg-cr-red-dark transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => dispatch('POWER_ON')}
                disabled={isRunning}
              >
                <Power size={13} />
                Encender
              </button>
              <button
                type="button"
                className="py-3 rounded-sm border border-cr-red text-cr-red font-condensed font-bold text-xs uppercase tracking-widest hover:bg-cr-red/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => dispatch('POWER_OFF')}
                disabled={!isRunning}
              >
                Apagar
              </button>
            </div>

            {state.step === STEPS.SHOCK_ADVISED && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded border-l-4 border-cr-red border-y border-r border-slate-200 shadow-sm p-4"
              >
                <img
                  src={deaImg}
                  alt="Operador alertando que nadie toque a la víctima antes de la descarga"
                  className="w-[104px] mx-auto mb-3"
                  draggable={false}
                />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-cr-red">⚠️ Antes de la descarga:</strong> asegurate de
                  que nadie esté tocando a la víctima. Si vos manejás el DEA, debés alertarlo en
                  voz alta al resto de las personas.
                </p>
              </motion.div>
            )}

            {state.step === STEPS.CPR && (
              <div className="bg-white rounded border border-slate-200 shadow-sm p-5 flex flex-col items-center gap-2">
                <span className="text-xs font-condensed font-bold text-cr-teal-dark uppercase tracking-widest pb-1 border-b-2 border-cr-teal">
                  Compresiones
                </span>
                <motion.div
                  key={compressionCount}
                  className="text-5xl font-black text-cr-ink"
                  animate={{ scale: [1, 1.2, 1] }}
                >
                  {compressionCount}
                  <span className="text-2xl text-slate-400">/30</span>
                </motion.div>
              </div>
            )}

            {state.step === STEPS.CPR && (
              <button
                type="button"
                className="w-full py-3 rounded-sm bg-cr-teal text-white font-condensed font-bold text-xs uppercase tracking-widest hover:bg-cr-teal-dark transition-colors shadow-sm"
                onClick={() => dispatch('CPR_COMPLETE')}
              >
                Siguiente ciclo
              </button>
            )}

            <button
              type="button"
              className="w-full py-3 rounded-sm border border-slate-300 bg-white text-slate-600 font-condensed font-bold text-xs uppercase tracking-widest hover:border-cr-red hover:text-cr-red transition-colors flex items-center justify-center gap-2 mt-auto"
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              Resetear simulación
            </button>
          </div>
        </div>

        {/* Dónde encontrar un DEA */}
        <section className="bg-white rounded border border-slate-200 shadow-sm p-5">
          <h2 className="font-condensed font-bold uppercase tracking-wide text-cr-ink pb-2 mb-3 border-b-2 border-cr-red inline-block">
            📌 ¿Dónde encuentro un DEA?
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <p className="text-sm text-slate-600 leading-relaxed flex-1">
              Podés encontrar un DEA en lugares como organismos públicos, estadios, clínicas,
              aeropuertos, terminales de transportes, etc. Siempre están guardados en gabinetes de
              emergencia señalizados con carteles, cerca de los matafuegos y elementos de
              seguridad.
            </p>
            <figure className="shrink-0 text-center">
              <img
                src={aedSignImg}
                alt="Cartel de señalización de un DEA, fondo verde con un corazón y un rayo"
                  className="w-20 mx-auto"
                draggable={false}
              />
              <figcaption className="mt-2 text-[11px] text-slate-400 max-w-40">
                El cartel puede decir AED (en inglés) o DEA (en español).
              </figcaption>
            </figure>
          </div>
        </section>
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
