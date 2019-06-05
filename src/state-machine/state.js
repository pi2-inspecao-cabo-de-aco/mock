import { randomValue } from '../helpers/generics'

let state = {
  state: 'waiting',
  currentAnalysis: {
    direction: 'right',
    location: 1,
    lastImageCapture: 0
  },
  currentInterval: null,
  endCable: randomValue(Array.from(Array(10), (x, index) => index + 20))
}

function setState (currentState) {
  let allowedStates = ['waiting', 'running', 'paused', 'reseting', 'moving_l', 'moving_r']
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

function setLastImageCapture (lastImageCapture) {
  state.currentAnalysis.lastImageCapture = lastImageCapture
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

function getEndCable () {
  return state.endCable
}

export {
  setState,
  getState,
  setCurrentAnalysisLocation,
  setCurrentAnalysisDirection,
  setLastImageCapture,
  getCurrentAnalysis,
  setCurrentInterval,
  getCurrentInterval,
  getEndCable
}
