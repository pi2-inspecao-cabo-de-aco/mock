import { getCurrentAnalysis } from '../state-machine/state'
import { pauseRobot } from '../state-machine/pause'
import { ciclingStates } from '../state-machine/index'
import { ftp } from '../ftp-client'

import Path from 'path'
import fsx from 'fs-extra'

let PUBLIC_FOLDER = Path.resolve(__dirname, '../../public')

async function endAnalisys () {
  let location = getCurrentAnalysis().location
  let filename = `${location}_end.zip`
  let zipPath = Path.join(PUBLIC_FOLDER, filename)
  await fsx.writeFile(zipPath, null, 'binary')
  let zipFile = await fsx.readFile(zipPath)
  ftp.put(zipFile, `public/${filename}`, (err) => {
    if (err) {
      console.log(`---------> Error: ${err.message} <---------`)
    }
    console.log(`------> Arquivo ${filename} enviado. Fim de curso.`)
  })
  await pauseRobot('pause', ciclingStates)
}

export {
  endAnalisys
}
