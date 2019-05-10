import express from 'express'

let states = {
  'waiting': {
    from: null,
    allowed: 'start'
  },
  'running': {
    from: ['waiting', 'paused'],
    allowed: ['pause', 'reset']
  },
  'paused': {
    from: 'running',
    allowed: ['continue', 'reset']
  },
  'reseting': {
    from: ['paused', 'running'],
    allowed: ['start']
  }
}

let stateMachine = {
  currentState: 'waiting',
  'start': initAnalisys,
  'pause': pauseRobot,
  'continue': continueRobot,
  'reset': resetState
}

function initAnalisys (command) {
  console.log('INICIANDO ANALISE')
}

function pauseRobot (command) {
  console.log('PAUSANDO ROBO')
}

function continueRobot (command) {
  console.log('CONTINUANDO ANÁLISE')
}

function resetState (command) {
  console.log('RESETANDO ESTADO DO ROBO')
}

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
        command(body.command)
      } else {
        throw new Error('Command not expected')
      }
    }
    res.send({ success: true })
  })
  return router
}
