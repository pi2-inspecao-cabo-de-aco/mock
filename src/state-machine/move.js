import {
  setState,
  getState,
  getCurrentAnalysis,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection,
  getEndCable
} from './state'
import { pauseRobot } from './pause'
import { getImages } from './init'
import { endAnalisys } from '../helpers/end-cable'
import { getAllowedCommands } from '../helpers/generics'

import fsx from 'fs-extra'
import { ftp } from '../ftp-client'

async function moveRobotR (command, ciclingStates) {
  let { location } = getCurrentAnalysis()
  let endCable = getEndCable()
  if (endCable === location) {
    await endAnalisys(location)
    return null
  }
  await pauseRobot('pause', ciclingStates)
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'right') {
    if (state === 'paused') {
      setState('moving_r')
      state = getState()
      console.log('----------------------------------------')
      console.log(`Máquina em movimento. Estado atual: "${state}"`)
      await setRightMove()
      await sendImages()
      await pauseRobot('pause', ciclingStates)
    } else if (state === 'moving_r') {
      return { err: 'Máquina já está em movimento, direção: direita' }
    } else {
      return { err: 'Robô não pode ser movimentado agora' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

async function moveRobotL (command, ciclingStates) {
  await pauseRobot('pause', ciclingStates)
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  let { location } = getCurrentAnalysis()
  if (command === 'left' && location > 1) {
    if (state === 'paused') {
      setState('moving_l')
      state = getState()
      console.log('----------------------------------------')
      console.log(`Robô em movimento. Estado atual: "${state}"`)
      await setLeftMove()
      await sendImages()
      await pauseRobot('pause', ciclingStates)
    } else if (state === 'moving_l') {
      return { err: 'Robô já está em movimento, direção: esquerda' }
    } else {
      return { err: 'Robô não pode ser movimentado agora' }
    }
  } else if (location === 1) {
    return { err: 'Robô já na posição inicial.' }
  } else {
    return { err: 'Comando ou estado não permitido' }
  }
}

async function setRightMove () {
  let { location, lastImageCapture } = getCurrentAnalysis()
  if (location === lastImageCapture) {
    setCurrentAnalysisLocation(location + 1)
  }
  setCurrentAnalysisDirection('right')
}

async function setLeftMove () {
  let { location, lastImageCapture } = getCurrentAnalysis()
  if (location === lastImageCapture) {
    setCurrentAnalysisLocation(location - 1)
  } else if (location === lastImageCapture + 1) {
    setCurrentAnalysisLocation(location - 2)
  }
  setCurrentAnalysisDirection('left')
}

async function sendImages () {
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
