import SectionTitle from './SectionTitle'
import aedSignImg from '../assets/aed.png'

export default function WhereToFindDea() {
  return (
    <section className="bg-white rounded border border-slate-200 shadow-sm p-5">
      <SectionTitle className="mb-3">¿Dónde encuentro un DEA?</SectionTitle>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <p className="text-sm text-slate-600 leading-relaxed flex-1">
          Podés encontrar un DEA en lugares como organismos públicos, estadios, clínicas,
          aeropuertos, terminales de transportes, etc. Siempre están guardados en gabinetes de
          emergencia señalizados con carteles, cerca de los matafuegos y elementos de seguridad. El
          cartel puede decir AED (en inglés) o DEA (en español).
        </p>
        <img
          src={aedSignImg}
          alt="Cartel de señalización de un DEA, fondo verde con un corazón y un rayo"
          className="w-20 shrink-0"
          draggable={false}
        />
      </div>
    </section>
  )
}
