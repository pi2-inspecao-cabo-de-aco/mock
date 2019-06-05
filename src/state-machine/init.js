import {
  setState,
  getState,
  setCurrentAnalysisLocation,
  getCurrentAnalysis,
  setCurrentInterval,
  setLastImageCapture,
  getEndCable
} from './state'

import {
  sleep,
  getAllowedCommands
} from '../helpers/generics'

import { endAnalisys } from '../helpers/end-cable'
import fsx from 'fs-extra'
import Path from 'path'
import nodeZip from 'node-zip'
import { ftp } from '../ftp-client'
// import util from 'util'

let IMAGES_FOLDER = Path.resolve(__dirname, '../../public')

async function getImages (direction, location) {
  let imagePath = Path.resolve(IMAGES_FOLDER, `${location}.png`)
  let image = await fsx.readFile(imagePath)
  const zip = nodeZip()
  for (let i = 0; i < 4; i++) {
    console.log(`------> Imagem da câmera ${i + 1}.`)
    zip.file(`imagem-cam-${i + 1}.png`, image)
  }
  let dataPath = Path.resolve(IMAGES_FOLDER, `data.txt`)
  let dataSensor
  try {
    dataSensor = await fsx.readFile(dataPath)
  } catch (err) {
    // ensure data.txt creation
    let array = Array.from(Array(50), (x, index) => index)
    let string = ''
    for (let i = 0; i < 10; i++) {
      string += array.join(',') + '\n'
    }
    await fsx.writeFile(dataPath, string)
    dataSensor = await fsx.readFile(dataPath)
  }
  zip.file(`dada.txt`, dataSensor)

  console.log('---> Zipando imagens.')
  let data = zip.generate({
    base64: false,
    compression: 'DEFLATE'
  })
  let time = Date.now()
  console.log('---> Criando zip')
  let filename = `${time}-${location}.zip`
  let zipPath = Path.join(IMAGES_FOLDER, filename)
  await fsx.writeFile(zipPath, data, 'binary')
  setLastImageCapture(location)
  return { zipPath, filename }
}

async function goRobot () {
  let { direction, location, lastImageCapture } = getCurrentAnalysis()
  let endCable = getEndCable()

  setState('running')
  let interval = setInterval(async () => {
    if (location === lastImageCapture) {
      setCurrentAnalysisLocation(location + 1)
      location = getCurrentAnalysis().location
    }
    if (endCable === location) {
      await endAnalisys(location)
      return null
    }
    console.log('---> Recebendo imagens')
    let { zipPath, filename } = await getImages(direction, location)
    // Simulando deslocamento do robo
    location = location + 1
    console.log(`---> Enviando arquivo ${filename}`)
    console.log(`Estado atual: "${getState()}".`)
    setCurrentAnalysisLocation(location)
    let zipFile = await fsx.readFile(zipPath)
    ftp.put(zipFile, `public/${filename}`, (err) => {
      if (err) {
        console.log(`---------> Error: ${err.message} <---------`)
      }
      console.log(`------> Arquivo ${filename} enviado.`)
    })
  }, 3000)
  setCurrentInterval(interval)
  await sleep(200000)
  await clearInterval(interval)
}

async function initAnalisys (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'start') {
    if (state === 'waiting' || state === 'paused' || state === 'reseting') {
      console.log('INICIANDO ANALISE')
      await goRobot()
    } else {
      return { err: 'Robô já iniciou uma análise.' }
    }
  } else {
    return { err: 'Comando ou estado não permitido.' }
  }
}

export {
  initAnalisys,
  goRobot,
  getImages
}
