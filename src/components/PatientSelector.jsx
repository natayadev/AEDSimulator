import { PATIENTS } from '../data/patients'

export default function PatientSelector({ selectedId, onSelect }) {
  return (
    <div className="flex gap-1.5">
      {Object.entries(PATIENTS).map(([id, patient]) => {
        const Icon = patient.icon
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`px-3 py-1.5 rounded-sm font-condensed font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
              selectedId === id
                ? 'bg-cr-red text-white shadow-sm'
                : 'border border-slate-300 text-slate-500 hover:border-cr-red hover:text-cr-red'
            }`}
          >
            <Icon size={14} />
            {patient.label}
          </button>
        )
      })}
    </div>
  )
}
