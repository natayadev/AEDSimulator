import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { STEPS } from '../states'
import PatientSelector from './PatientSelector'
import SectionTitle from './SectionTitle'

function DraggablePad({ padId, label, variant, shaking, onDragStart, onDragEnd }) {
  const colors =
    variant === 'solid'
      ? 'bg-cr-red border-2 border-white text-white'
      : 'bg-white border-2 border-cr-red text-cr-red'

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragSnapToOrigin
      className={`w-16 h-16 rounded ${colors} text-[10px] font-condensed font-bold uppercase flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing shadow-md z-20 relative`}
      onDragStart={(event) => onDragStart(event, padId)}
      onDragEnd={(event, info) => onDragEnd(event, padId, padId, info)}
      animate={shaking ? { x: [-10, 10, -10, 10, 0] } : {}}
    >
      <span className="opacity-75">Parche</span>
      <span>{label}</span>
    </motion.div>
  )
}

export default function ManikinBoard({
  patient,
  patientId,
  step,
  padsPlaced,
  shakePad,
  shockFlash,
  leftDropRef,
  rightDropRef,
  onSelectPatient,
  onDrop,
  onDragStart,
  onDragEnd,
  onShock,
}) {
  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-3 flex-wrap">
        <SectionTitle as="h3">Elegí a quién asistir</SectionTitle>
        <PatientSelector selectedId={patientId} onSelect={onSelectPatient} />
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
            onDrop={(event) => onDrop(event, zoneId)}
          >
            {!padsPlaced[zoneId] && step === STEPS.PLACE_PADS && (
              <span
                className={`absolute ${zoneId === 'left' ? '-top-5' : '-bottom-5'} left-1/2 -translate-x-1/2 text-[10px] font-condensed font-bold uppercase tracking-widest text-cr-red/70 whitespace-nowrap`}
              >
                {zone.label}
              </span>
            )}
          </div>
        ))}

        {step === STEPS.SHOCK_ADVISED && (
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
              onClick={onShock}
            >
              <Zap size={26} />
              Shock
            </motion.button>
          </div>
        )}
      </div>

      {/* Bandeja de parches */}
      {step === STEPS.PLACE_PADS && (!padsPlaced.left || !padsPlaced.right) && (
        <div className="border-t border-slate-200 bg-cr-paper px-5 py-3">
          <p className="text-[11px] font-condensed font-bold uppercase tracking-widest text-slate-500 mb-2">
            Arrastrá los parches hasta las zonas marcadas
          </p>
          <div className="flex gap-4">
            {!padsPlaced.left && (
              <DraggablePad
                padId="left"
                label={patient.zones.left.label}
                variant="solid"
                shaking={shakePad === 'left'}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            )}
            {!padsPlaced.right && (
              <DraggablePad
                padId="right"
                label={patient.zones.right.label}
                variant="outline"
                shaking={shakePad === 'right'}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
