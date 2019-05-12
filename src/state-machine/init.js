import {
  setState,
  getState,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection,
  getCurrentAnalysis
} from './state'
import { sleep } from '../helpers/generics'
import fsx from 'fs-extra'
import Path from 'path'
import nodeZip from 'node-zip'

let IMAGES_FOLDER = Path.resolve(__dirname, '../../public')

async function getImages (direction, location) {
  // read image based on location and direction attribute
  let imagePath = Path.resolve(IMAGES_FOLDER, `${location}.png`)
  let image = await fsx.readFile(imagePath)
  const zip = nodeZip()
  for (let i = 0; i < 4; i++) {
    zip.file(`imagem-cam-${i + 1}.png`, image)
  }
  let data = zip.generate({
    base64: false,
    compression: 'DEFLATE'
  })
  await fsx.writeFile(Path.join(IMAGES_FOLDER, 'zipin.zip'), data, 'binary')
  // join images and create zip
  // send images using FTP
}

async function goRobot () {
  let { direction, location } = getCurrentAnalysis()
  await getImages(direction, location)
}

async function initAnalisys (command) {
  console.log('CHECANDO ESTADO DA MÁQUINA...')
  let state = getState()
  console.log(`Estado atual: "${state}". Comando desejado: "${command}"`)
  if (command === 'start' && state === 'waiting') {
    console.log('INICIANDO ANALISE')
    await goRobot()
  } else {
    throw new Error('Comando ou estado não permitido.')
  }
}

export {
  initAnalisys,
  goRobot
}
