export const Keys = {
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Space: ' '
}

export class KeyboardListener {
  constructor() {
    this.subscribers = []

    window.addEventListener('keydown', e => this.onKeyDown(e))
  }

  onKeyDown(e) {
    e.preventDefault()
    const key = e.key
    for (const subscriber of this.subscribers) {
      if (subscriber.key === key) {
        subscriber.callback()
      }
    }
  }

  subscribe(key, callback) {
    this.subscribers.push({key, callback})
  }

  destroy() {
    this.subscribers = []
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
