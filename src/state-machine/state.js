let state = {
  state: 'waiting',
  currentAnalysis: {
    direction: 'right',
    location: 1
  },
  currentInterval: null
}

function setState (state) {
  state.state = state
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
