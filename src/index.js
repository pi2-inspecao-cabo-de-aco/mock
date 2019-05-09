import JSFtp from 'jsftp'
import fsx from 'fs-extra'
import Path from 'path'
import ftpClient from './ftp-client.js'
import express from 'express'
import controlApi from './api/control'
import bodyParser from 'body-parser'

async function main () {
  let ftp = new JSFtp({
    host: process.env.HOST || 'localhost',
    port: 30003
  })

  ftp.auth('pi2', 'pi2', async (err, res) => {
    await ftpClient(err, res, ftp)
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
