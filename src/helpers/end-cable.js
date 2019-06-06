import { getCurrentAnalysis } from '../state-machine/state'
import { pauseRobot } from '../state-machine/pause'
import { ciclingStates } from '../state-machine/index'
import { ftp } from '../ftp-client'
import { getImages } from '../state-machine/init'

import fsx from 'fs-extra'

async function endAnalisys () {
  let location = getCurrentAnalysis().location
  let { zipPath, filename } = await getImages(undefined, location, true)
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
