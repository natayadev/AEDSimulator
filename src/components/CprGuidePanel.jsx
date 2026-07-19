import { motion } from 'framer-motion'

/** Panel teal con la técnica de compresiones del paciente activo (visible durante la RCP) */
export default function CprGuidePanel({ patient }) {
  return (
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
  )
}
