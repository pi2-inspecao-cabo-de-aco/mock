import {
  setState,
  getState,
  getCurrentAnalysis,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection
} from './state'
import { pauseRobot } from './pause'
import { getImages } from './init'
import { getAllowedCommands } from '../helpers/generics'

import fsx from 'fs-extra'
import { ftp } from '../ftp-client'

async function moveRobotR (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  console.log('--------------------------------------')
  console.log('COMANDO: ' + command)
  console.log('STATE: ' + state)
  if (command === 'mover') {
    if (state === 'paused') {
      setState('movingr')
      state = getState()
      console.log('----------------------------------------')
      console.log(`Máquina em movimento. Estado atual: "${state}"`)
      await setRightMove()
      await sendImages()
      await pauseRobot('pause', ciclingStates)
    } else if (state === 'movingr') {
      return { err: '' }
    } else {
      return { err: '' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

async function moveRobotL (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  console.log('--------------------------------------')
  console.log('COMANDO: ' + command)
  console.log('STATE: ' + state)
  if (command === 'movel') {
    if (state === 'paused') {
      setState('movingl')
      state = getState()
      console.log('----------------------------------------')
      console.log(`Máquina em movimento. Estado atual: "${state}"`)
      await setLeftMove()
      await sendImages()
      await pauseRobot('pause', ciclingStates)
    } else if (state === 'movingl') {
      return { err: '' }
    } else {
      return { err: '' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
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
