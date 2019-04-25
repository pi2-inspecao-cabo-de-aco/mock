import JSFtp from 'jsftp'
import fsx from 'fs-extra'
import Path from 'path'

async function main () {
  let ftp = new JSFtp({
    host: process.env.HOST || 'localhost',
    port: 30003
  })

  ftp.auth('pi2', 'pi2', async (err, res) => {
    if (err) {
      console.log('Erro on authentication.', err)
      throw new Error(err.message)
    }

    let path = Path.resolve(__dirname, '../imagem71.jpg')
    let file = await fsx.readFile(path)
    ftp.put(file, '/teste.jpg', (err, res) => {
      console.log(err, res)
    })
  })
}

main().then().catch(console.log)
