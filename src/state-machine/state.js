let state = {
  state: 'waiting',
  currentAnalysis: {
    direction: 'right',
    location: 1
  },
  currentInterval: null
}

function setState (currentState) {
  let allowedStates = ['waiting', 'running', 'paused', 'reseting', 'movingl', 'movingr']
  let index = allowedStates.indexOf(currentState)
  if (index > -1) {
    state.state = currentState
  } else {
    throw new Error('Estado não permitido')
  }
}

function getState () {
  return state.state
}

function setCurrentAnalysisLocation (location) {
  state.currentAnalysis.location = location
}

function setCurrentAnalysisDirection (direction) {
  state.currentAnalysis.direction = direction
}

function getCurrentAnalysis () {
  return state.currentAnalysis
}

function setCurrentInterval (interval) {
  state.currentInterval = interval
}

function getCurrentInterval () {
  return state.currentInterval
}

export {
  setState,
  getState,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection,
  getCurrentAnalysis,
  setCurrentInterval,
  getCurrentInterval
}
