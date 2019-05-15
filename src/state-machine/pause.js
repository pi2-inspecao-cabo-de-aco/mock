import {
  setState,
  getState,
  setCurrentAnalysisLocation,
  getCurrentAnalysis
} from './state'
import { sleep, getAllowedCommands } from '../helpers/generics'

async function pauseRobot () {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'pause') {
    if (state === 'waiting') {
      // what pause should do? Just change the state of state_machine ?
    } else {
      // Put the correct error here
      return { err: '' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

export {
  pauseRobot
}
