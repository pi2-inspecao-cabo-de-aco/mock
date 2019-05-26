import { getState } from './state'
import { initAnalisys } from './init'
import { pauseRobot } from './pause'
import { continueRobot } from './continue'
import { resetState } from './reset'
import { moveRobotR } from './move'

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
    allowed: ['continue', 'reset', 'mover', 'movel']
  },
  'reseting': {
    from: ['paused', 'running'],
    allowed: ['start']
  },
  'movingl': {
    from: ['paused'],
    allowed: ['start', 'reset']
  },
  'movingr': {
    from: ['paused'],
    allowed: ['start', 'reset']
  }
}

let stateMachine = {
  'start': initAnalisys,
  'pause': pauseRobot,
  'continue': continueRobot,
  'reset': resetState,
  // 'movel': moveRobotL,
  'mover': moveRobotR
}

export {
  getState as state,
  ciclingStates,
  stateMachine
}
