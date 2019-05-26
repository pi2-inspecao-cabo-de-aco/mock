import {
  setState,
  getState,
  setCurrentInterval,
  getCurrentInterval,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection,
} from './state'
import { getAllowedCommands } from '../helpers/generics'

async function moveRobot (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  // flow que deve ter aqui:
  // verificar se o estado é o paused.
  // colocar estado como movingl ou movingr
  // Mover o robo na direcao correta. (usar a funcao correta para isso)
  // rodar o goRobot apenas uma vez
  // voltar para o estado de paused
  if (command === 'move') {
    if (state === 'pased') {
      let interval = getCurrentInterval()
      setCurrentInterval(clearInterval(interval))
      setState('moving')
      state = getState()
      console.log('----------------------------------------')
      console.log(`Máquina parada. Estado atual: "${state}"`)
    } else if (state === 'moving') {
      return { err: '' }
    } else {
      return { err: '' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

export {
  pauseRobot
}
