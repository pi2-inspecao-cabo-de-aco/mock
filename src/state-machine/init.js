import {
  setState,
  getState,
  setCurrentAnalysisLocation,
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
  let zipPath = Path.join(IMAGES_FOLDER, `${time}-${location}.zip`)
  await fsx.writeFile(zipPath, data, 'binary')
  return zipPath
}

async function goRobot () {
  let { direction, location } = getCurrentAnalysis()
  let interval = setInterval(async () => {
    console.log('---> Recebendo imagens')
    let zipPath = await getImages(direction, location)
    // simulate robot displacement
    location = location + 1
    console.log(`---> Enviando arquivo ${zipPath}`)
    setCurrentAnalysisLocation(location)
  }, 2000)
  await sleep(20000)
  clearInterval(interval)

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
