import express from 'express'
import { stateMachine, ciclingStates } from '../state-machine'

export default () => {
  let router = express.Router()
  router.get('/', async (req, res) => {
    res.send({ oi: false })
  })

  router.post('/', async (req, res) => {
    let { body } = req
    if (body && body.command) {
      let command = stateMachine[body.command]
      if (command && typeof command === 'function') {
        try {
          // eslint-disable-next-line
          new Promise(async (resolve, reject) => {
            await command(body.command, ciclingStates)
            resolve()
            // if (result && result.err) {
            //   res.status(500).send(result.err)
            // }
          })
          res.status(200).send({ success: true })
        } catch (err) {
          res.status(500).send(err.message)
        }
      } else {
        res.status(500).send('Comando não esperado ou permitido.')
      }
    }
  })
  return router
}
