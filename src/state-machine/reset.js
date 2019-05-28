import {
  setState,
  getState,
  setCurrentInterval,
  getCurrentInterval,
  setCurrentAnalysisLocation
  // setCurrentAnalysisDirection
} from './state'
import { getAllowedCommands } from '../helpers/generics'

async function resetState (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'reset') {
    if (state === 'running' || state === 'paused') {
      let interval = getCurrentInterval()
      setCurrentInterval(clearInterval(interval))
      setState('reseting')
      setCurrentAnalysisLocation(1)
      state = getState()
      // Reiniciar a maquina aqui
      console.log('----------------------------------------')
      console.log(`Máquina será reiniciada. Estado atual: "${state}"`)
    } else if (state === 'reseting') {
      return { err: 'Máquina reiniciada' }
    } else {
      return { err: 'O robô não pode ser parado agora. Tente outro comando' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

export {
  resetState
}
