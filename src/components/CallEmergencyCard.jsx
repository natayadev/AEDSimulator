import { motion } from 'framer-motion'
import { PhoneCall } from 'lucide-react'

export default function CallEmergencyCard({ onConfirm }) {
  return (
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
        onClick={onConfirm}
      >
        Sí, ya llamé
      </button>
    </motion.div>
  )
}
