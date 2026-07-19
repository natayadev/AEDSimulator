export const STEPS = {
  OFF: 'OFF',
  POWER_ON: 'POWER_ON',
  CALL_911: 'CALL_911',
  START: 'START',
  PLACE_PADS: 'PLACE_PADS',
  ANALYZING: 'ANALYZING',
  SHOCK_ADVISED: 'SHOCK_ADVISED',
  CPR: 'CPR',
  RECOVERED: 'RECOVERED',
}

// Cantidad de descargas tras la cual se detecta pulso
export const SHOCKS_TO_RECOVER = 2

export const INITIAL_STATE = { step: STEPS.OFF, shocks: 0 }

// Mensaje que muestra el monitor (y lee la voz) en cada paso
export const STATUS_TEXT = {
  [STEPS.OFF]: 'DEA apagado',
  [STEPS.CALL_911]: 'Activá el sistema de emergencias antes de continuar.',
  [STEPS.START]: 'Quita la ropa del pecho de la persona.',
  [STEPS.PLACE_PADS]: 'Coloque parches',
  [STEPS.ANALYZING]: 'Evaluando la frecuencia cardiaca',
  [STEPS.SHOCK_ADVISED]: '¡Descarga recomendada!',
  [STEPS.CPR]: 'Inicie RCP por 2 minutos',
  [STEPS.RECOVERED]: 'Pulso detectado',
}

function getActionType(action) {
  if (typeof action === 'string') {
    return action
  }

  return action?.type
}

export function reducer(state, action) {
  const type = getActionType(action)

  switch (type) {
    case 'POWER_ON':
      return { ...state, step: STEPS.CALL_911, shocks: 0 }
    case 'CALL_911_DONE':
      return { ...state, step: STEPS.START }
    case 'PLACE_PADS':
      return { ...state, step: STEPS.PLACE_PADS }
    case 'PADS_PLACED':
      return { ...state, step: STEPS.ANALYZING }
    case 'SHOCK_NEEDED':
      return { ...state, step: STEPS.SHOCK_ADVISED }
    case 'NO_SHOCK':
      return { ...state, step: STEPS.CPR }
    case 'SHOCK_DELIVERED': {
      const shocks = state.shocks + 1
      if (shocks >= SHOCKS_TO_RECOVER) {
        return { ...state, step: STEPS.RECOVERED, shocks }
      }
      return { ...state, step: STEPS.CPR, shocks }
    }
    case 'CPR_COMPLETE':
      return { ...state, step: STEPS.ANALYZING }
    case 'POWER_OFF':
      return { ...state, step: STEPS.OFF, shocks: 0 }
    default:
      return state
  }
}
