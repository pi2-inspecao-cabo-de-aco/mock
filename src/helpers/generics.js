function sleep (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout || 1000)
  })
}

function getAllowedCommands (command, ciclingStates) {
  return ciclingStates[command].allowed
}

function randomValue (array) {
  return array[Math.floor(Math.random() * array.length)]
}

export {
  sleep,
  getAllowedCommands,
  randomValue
}
