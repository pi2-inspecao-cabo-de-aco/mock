import {
  setState,
  getState
} from './state'
import { getAllowedCommands } from '../helpers/generics'

async function pauseRobot (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'pause') {
    if (state === 'running') {
      setState('paused')
      state = getState()
      console.log('----------------------------------------');
      console.log(`Máquina parada. Estado atual: "${state}"`);
    } else if (state === 'paused') {
      // Put the correct error here
      return { err: 'Robô já está parado' }
    } else {
      return { err: 'O robô não pode ser parado agora. Tente outro comando' } 
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

export {
  pauseRobot
}
