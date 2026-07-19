import { motion } from 'framer-motion'
import { Power, RotateCcw } from 'lucide-react'
import { STEPS } from '../states'
import VisualDisplay from './VisualDisplay'
import deaImg from '../assets/dea.png'

/** Columna derecha: el "equipo DEA" (monitor, encendido, advertencia de descarga y contador) */
export default function DevicePanel({
  step,
  message,
  touchWarning,
  isRunning,
  compressionCount,
  onPowerOn,
  onPowerOff,
  onNextCycle,
  onReset,
}) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4 h-full">
      <VisualDisplay step={step} message={message} touchWarning={touchWarning} />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="py-3 rounded-sm bg-cr-red text-white font-condensed font-bold text-xs uppercase tracking-widest hover:bg-cr-red-dark transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onPowerOn}
          disabled={isRunning}
        >
          <Power size={13} />
          Encender
        </button>
        <button
          type="button"
          className="py-3 rounded-sm border border-cr-red text-cr-red font-condensed font-bold text-xs uppercase tracking-widest hover:bg-cr-red/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onPowerOff}
          disabled={!isRunning}
        >
          Apagar
        </button>
      </div>

      {step === STEPS.SHOCK_ADVISED && (
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
            <strong className="text-cr-red">⚠️ Antes de la descarga:</strong> asegurate de que
            nadie esté tocando a la víctima. Si vos manejás el DEA, debés alertarlo en voz alta al
            resto de las personas.
          </p>
        </motion.div>
      )}

      {step === STEPS.CPR && (
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

      {step === STEPS.CPR && (
        <button
          type="button"
          className="w-full py-3 rounded-sm bg-cr-teal text-white font-condensed font-bold text-xs uppercase tracking-widest hover:bg-cr-teal-dark transition-colors shadow-sm"
          onClick={onNextCycle}
        >
          Siguiente ciclo
        </button>
      )}

      <button
        type="button"
        className="w-full py-3 rounded-sm border border-slate-300 bg-white text-slate-600 font-condensed font-bold text-xs uppercase tracking-widest hover:border-cr-red hover:text-cr-red transition-colors flex items-center justify-center gap-2 mt-auto"
        onClick={onReset}
      >
        <RotateCcw size={14} />
        Resetear simulación
      </button>
    </div>
  )
}
