import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { STEPS } from '../states'

function EcgWave() {
  return (
    <svg viewBox="0 0 300 60" className="w-full h-12" role="img" aria-label="ECG">
      <motion.path
        d="M0 30 L25 30 L35 15 L45 45 L55 30 L95 30 L105 10 L115 50 L125 30 L165 30 L175 20 L185 40 L195 30 L235 30 L245 12 L255 48 L265 30 L300 30"
        fill="none"
        stroke="#4ade80"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}

export default function VisualDisplay({ step, message, touchWarning = 'No tocar' }) {
  useEffect(() => {
    if (step === STEPS.ANALYZING) {
      console.log(`[DEA voz] ${touchWarning}`)
    }
  }, [step, touchWarning])

  const isOff = step === STEPS.OFF

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-cr-red text-white">
        <Activity size={16} />
        <span className="font-condensed font-bold uppercase tracking-widest text-xs">
          Monitor
        </span>
        <span
          className={`ml-auto w-2.5 h-2.5 rounded-full ${
            isOff ? 'bg-white/30' : 'bg-green-400 animate-pulse'
          }`}
        />
      </div>
      <div className="bg-cr-screen text-green-400 px-4 py-3 font-mono min-h-20 flex flex-col justify-center gap-1.5">
        <p className={`text-base sm:text-lg ${isOff ? 'text-green-400/40' : ''}`}>{message}</p>
        {step === STEPS.ANALYZING && (
          <>
            <p className="text-red-400 text-sm font-semibold">{touchWarning}</p>
            <EcgWave />
          </>
        )}
      </div>
    </div>
  )
}
