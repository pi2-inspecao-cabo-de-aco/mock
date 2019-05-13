function sleep (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout || 1000)
  })
}

function getAllowedCommands (command, ciclingStates) {
  return ciclingStates[command].allowed
}

export {
  sleep,
  getAllowedCommands
}
