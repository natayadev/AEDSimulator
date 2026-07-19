import SectionTitle from './SectionTitle'

export default function HowItWorksCard({ noun }) {
  return (
    <aside className="bg-white rounded border border-slate-200 shadow-sm p-5 h-full flex flex-col">
      <SectionTitle as="h3" className="mb-4">
        ¿Cómo funciona?
      </SectionTitle>
      <ol className="text-sm space-y-3 text-slate-600 leading-relaxed list-decimal list-inside">
        <li>Verificá que {noun} no responda y no respire.</li>
        <li>Llamá a emergencias (107 / 911).</li>
        <li>Encendé el DEA: idealmente mientras alguien hace RCP, otro prepara el DEA.</li>
        <li>Quitale la ropa del torso: el pecho debe quedar descubierto y seco.</li>
        <li>Colocá los parches sobre {noun}.</li>
        <li>Seguí las indicaciones del equipo.</li>
      </ol>
    </aside>
  )
}
