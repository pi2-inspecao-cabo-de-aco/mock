import {
  setState,
  getState,
  setCurrentInterval,
  getCurrentInterval,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection,
} from './state'
import { pauseRobot } from './pause'
import { getImages } from './init'
import { getAllowedCommands } from '../helpers/generics'
import { ciclingStates } from '../state-machine'

import fsx from 'fs-extra'
import Path from 'path'
import nodeZip from 'node-zip'
import { ftp } from '../ftp-client'

async function moveRobotR (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'movel') {
    if (state === 'pased') {
      // flow que deve ter aqui:
      // verificar se o estado é o paused.
      // colocar estado como movingl ou movingr
      // Mover o robo na direcao correta. (usar a funcao correta para isso)
      // rodar o goRobot apenas uma vez
      // voltar para o estado de paused
      setState('movingr')
      state = getState()
      console.log('----------------------------------------')
      console.log(`Máquina em movimento. Estado atual: "${state}"`)
      await setRightMove()
      await sendImages()
      pauseRobot('pause', ciclingStates)
    } else if (state === 'moving') {
      return { err: '' }
    } else {
      return { err: '' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}
async function setRightMove() {
  let { direction, location } = getCurrentAnalysis()
  setCurrentAnalysisLocation(location + 1)
  setCurrentAnalysisDirection('right')
}
async function sendImages() {
  let { direction, location } = getCurrentAnalysis()
  let { zipPath, filename } = await getImages(direction, location)
  console.log(`---> Enviando arquivo ${filename}`)
  let zipFile = await fsx.readFile(zipPath)
  ftp.put(zipFile, `public/${filename}`, (err) => {
    if (err) {
      console.log(`---------> Error: ${err.message} <---------`)
    }
    console.log(`------> Arquivo ${filename} enviado.`)
  })
}

export {
  moveRobotR,
  moveRobotL
}
