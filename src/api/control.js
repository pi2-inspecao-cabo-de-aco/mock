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
      console.log('COMMAND AND BODY-------------------------------------------')
      console.log(command)
      console.log(body)
      if (command && typeof command === 'function') {
        try {
          let result = await command(body.command, ciclingStates)
          if (result && result.err) {
            res.status(500).send(result.err)
          }
        } catch (err) {
          res.status(500).send(err.message)
        }
      } else {
        res.status(500).send('Comando não esperado ou permitido.')
      }
    }
    res.send({ success: true })
  })
  return router
}
