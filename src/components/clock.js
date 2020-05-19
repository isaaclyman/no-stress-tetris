class Clock {
  constructor(intervalInMs) {
    this.subscribers = []
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
    this.interval = setInterval(() => {
      this.subscribers.forEach(s => s())
    }, intervalInMs)
  }

  destroy() {
    this.subscribers = []
    clearInterval(this.interval)
  }
}

export default Clock;