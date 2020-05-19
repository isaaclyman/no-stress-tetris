class Clock {
  constructor(intervalInMs) {
    this.subscribers = []
    this.intervalTime = intervalInMs
    this.changeInterval(intervalInMs)
  }

  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Subscribers to Clock must be functions.')
    }

    this.subscribers.push(callback)
  }

  unsubscribe(callback) {
    const ix = this.subscribers.indexOf(callback)
    if (ix === -1) {
      return
    }

    this.subscribers.splice(ix, 1)
  }

  changeInterval(intervalInMs) {
    clearInterval(this.interval)
    this.intervalTime = intervalInMs
    this.isRunning = true
    this.interval = setInterval(() => {
      this.subscribers.forEach(s => s())
    }, intervalInMs)
  }

  destroy() {
    this.subscribers = []
    clearInterval(this.interval)
    this.isRunning = false
  }

  pause() {
    clearInterval(this.interval)
    this.isRunning = false
  }

  resume() {
    this.changeInterval(this.intervalTime)
  }

  isPaused() {
    return !this.isRunning
  }
}

export default Clock;