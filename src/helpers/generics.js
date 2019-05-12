const sleep = (timeout) => new Promise((resolve, reject) => setTimeout(resolve, timeout || 1000))

export {
  sleep
}
