import express from 'express'
import { stateMachine } from '../state-machine'

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
        await command(body.command)
      } else {
        throw new Error('Command not expected')
      }
    }
    res.send({ success: true })
  })
  return router
}
