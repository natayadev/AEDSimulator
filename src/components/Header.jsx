import { HeartPulse } from 'lucide-react'

export default function Header() {
  return (
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
  )
}
