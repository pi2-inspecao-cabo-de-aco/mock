import {
  setState,
  getState,
  setCurrentAnalysisLocation,
  getCurrentAnalysis,
  setCurrentInterval,
  setLastImageCapture
} from './state'
import { sleep, getAllowedCommands } from '../helpers/generics'
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
  setState('running')
  let interval = setInterval(async () => {
    if (location === lastImageCapture) {
      setCurrentAnalysisLocation(location + 1)
      location = getCurrentAnalysis().location
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
  }, 2000)
  setCurrentInterval(interval)
  // TODO: Simular o fim do curso do robo
  await sleep(20000)
  clearInterval(interval)
}

async function initAnalisys (command, ciclingStates) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando(s) desejado(s): "${getAllowedCommands(state, ciclingStates).join('; ')}"`)
  if (command === 'start') {
    if (state === 'waiting' || state === 'paused') {
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
