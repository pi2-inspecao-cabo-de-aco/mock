import JSFtp from 'jsftp'
import fsx from 'fs-extra'
import Path from 'path'

export default async (err, response, ftp) => {
  if (err) {
    console.log('Erro on authentication.', err)
    throw new Error(err.message)
  }
  // let path = Path.resolve(__dirname, '../imagem71.jpg')
  // let file = await fsx.readFile(path)
  // ftp.put(file, '/teste.jpg', (err, res) => {
  // })
}
