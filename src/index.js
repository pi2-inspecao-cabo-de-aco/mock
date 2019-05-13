import JSFtp from 'jsftp'
import { setFTP } from './ftp-client.js'
import express from 'express'
import controlApi from './api/control'
import bodyParser from 'body-parser'

async function main () {
  let ftpInstance = new JSFtp({
    host: process.env.HOST || 'localhost',
    port: 30003
  })

  ftpInstance.auth('pi2', 'pi2', async (err, res) => {
    console.log('FTP autenticado. Permissão para transferir arquivos.')
    await setFTP(err, res, ftpInstance)
  })

  let app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/control', controlApi())
  app.listen(3030, () => {
    console.log('Server running on htttp://localhost:3030')
  })
}

main().then().catch(console.log)
