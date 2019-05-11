import { initAnalisys } from './init'
import { pauseRobot } from './pause'
import { continueRobot } from './continue'
import { resetState } from './reset'

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

export {
  states,
  stateMachine
}
