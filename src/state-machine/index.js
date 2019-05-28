import { getState } from './state'
import { initAnalisys } from './init'
import { pauseRobot } from './pause'
import { continueRobot } from './continue'
import { resetState } from './reset'
import { moveRobotL, moveRobotR } from './move'

let ciclingStates = {
  'waiting': {
    from: null,
    allowed: ['start']
  },
  'running': {
    from: ['waiting', 'paused'],
    allowed: ['pause', 'reset']
  },
  'paused': {
    from: 'running',
    allowed: ['continue', 'reset', 'right', 'left']
  },
  'reseting': {
    from: ['paused', 'running'],
    allowed: ['start']
  },
  'moving_l': {
    from: ['paused'],
    allowed: ['start', 'reset']
  },
  'moving_r': {
    from: ['paused'],
    allowed: ['start', 'reset']
  }
}

let stateMachine = {
  'start': initAnalisys,
  'pause': pauseRobot,
  'continue': continueRobot,
  'reset': resetState,
  'left': moveRobotL,
  'right': moveRobotR
}

export {
  getState as state,
  ciclingStates,
  stateMachine
}
