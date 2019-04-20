import FtpSrv from 'ftp-srv'

async function main () {
  let server = new FtpSrv()

  server.on('login', (data, resolve, reject) => {
    console.log('Connection stablished.')
    resolve()
  })

  server.listen({
    host: 'localhost'
  })
}

main().then().catch(console.log)
