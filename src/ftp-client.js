let ftp = null

function setFTP (err, response, ftpConfig) {
  if (err) {
    console.log('Erro on authenticate.', err)
    throw new Error(err.message)
  }
  ftp = ftpConfig
}

export {
  ftp,
  setFTP
}
