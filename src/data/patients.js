import { Baby, PersonStanding, User } from 'lucide-react'
import adultoImg from '../assets/adulto.png'
import infanteImg from '../assets/infante.png'
import bebeImg from '../assets/bebe.png'
import rcpAdultoImg from '../assets/rcp-adulto.png'
import rcpInfanteImg from '../assets/rcp-infante.png'
import rcpBebeImg from '../assets/rcp-bebe.png'

export const INITIAL_PADS_STATE = {
  left: false,
  right: false,
}

export const PATIENTS = {
  adulto: {
    label: 'Adulto',
    noun: 'la persona',
    icon: User,
    img: adultoImg,
    alt: 'Muñeco de entrenamiento adulto',
    touchWarning: 'No tocar a la persona',
    recoveredMsg:
      'Colocá a la persona en posición lateral de seguridad y esperá a los servicios de emergencia.',
    zoneSize: 'w-16 h-16 sm:w-20 sm:h-20',
    zones: {
      left: { label: 'Esternón', x: '37%', y: '58%' },
      right: { label: 'Axila', x: '65%', y: '70%' },
    },
    cprImg: rcpAdultoImg,
    cprGuide: [
      ['Manos', 'talón de una mano en el centro del pecho, la otra encima y dedos entrecruzados.'],
      ['Frecuencia', '100 a 120 por minuto.'],
      ['Profundidad', '5 a 6 cm, fuerte y rápido.'],
      ['Ritmo', 'igual tiempo de compresión que de relajación; no interrumpas más de 10 segundos.'],
    ],
    source: 'Manual de Primeros Auxilios (30 hs) — Cruz Roja Argentina',
  },
  infante: {
    label: 'Infante',
    noun: 'el infante',
    icon: PersonStanding,
    img: infanteImg,
    alt: 'Muñeco de entrenamiento infante',
    touchWarning: 'No tocar a la persona',
    recoveredMsg:
      'Colocá al infante en posición lateral de seguridad y esperá a los servicios de emergencia.',
    zoneSize: 'w-14 h-14 sm:w-16 sm:h-16',
    zones: {
      left: { label: 'Esternón', x: '38%', y: '60%' },
      right: { label: 'Axila', x: '64%', y: '71%' },
    },
    cprImg: rcpInfanteImg,
    cprGuide: [
      ['Manos', 'una sola mano en el centro del pecho; la otra en la frente para sostener la cabeza.'],
      ['Insuflaciones', 'realizá 2 insuflaciones de rescate (boca a boca), como si fueras a inflar un globo.'],
      ['Frecuencia', '100 a 120 por minuto.'],
      ['Ritmo', 'igual tiempo de compresión que de relajación.'],
    ],
    source: 'Manual de Primeros Auxilios (30 hs) — Cruz Roja Argentina',
  },
  bebe: {
    label: 'Bebé',
    noun: 'el bebé',
    icon: Baby,
    img: bebeImg,
    alt: 'Muñeco de entrenamiento bebé',
    touchWarning: 'No tocar a la persona',
    recoveredMsg:
      'Colocá al bebé en posición lateral de seguridad, mantenelo abrigado y esperá a los servicios de emergencia.',
    zoneSize: 'w-12 h-12 sm:w-14 sm:h-14',
    zones: {
      left: { label: 'Pecho', x: '49%', y: '36%' },
      right: { label: 'Costado', x: '63%', y: '44%' },
    },
    cprImg: rcpBebeImg,
    cprGuide: [
      ['Manos', 'dos dedos en el centro del pecho y una mano en la frente para sostener la cabeza.'],
      ['Insuflaciones', 'realizá 2 insuflaciones de rescate (boca a boca), como si soplaras una vela.'],
      ['Frecuencia', '100 a 120 por minuto.'],
      ['Ritmo', 'igual tiempo de compresión que de relajación.'],
    ],
    source: 'Manual de Primeros Auxilios (30 hs) — Cruz Roja Argentina',
  },
}
