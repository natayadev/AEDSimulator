import SectionTitle from './SectionTitle'

export default function AboutDea() {
  return (
    <section className="bg-white rounded border border-slate-200 shadow-sm p-5">
      <SectionTitle className="mb-3">¿Qué es el DEA?</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed">
        El DEA (Desfibrilador Externo Automático) es un dispositivo electrónico portátil que
        diagnostica y puede ayudar a restablecer el ritmo cardíaco cuando una persona sufre un paro
        cardíaco. La desfibrilación consiste en emitir un impulso de corriente continua al corazón,
        para tratar que el mismo retome su ritmo normal.
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
  )
}
