import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import posicionLateralImg from '../assets/posicion-lateral.png'

export default function RecoveredCard({ patient }) {
  return (
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
        <h2 className="text-2xl font-condensed font-bold uppercase">¡Pulso detectado!</h2>
        <p className="text-white/90 text-sm max-w-sm mx-auto">{patient.recoveredMsg}</p>
      </div>
      <img
        src={posicionLateralImg}
        alt="Posición lateral de seguridad"
        className="w-full max-w-[300px]"
        draggable={false}
      />
    </motion.div>
  )
}
