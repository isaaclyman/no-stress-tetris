<template>
  <div class="grid">
    <div class="line" v-for="(line, lIndex) in grid" :key="`line-${lIndex}`">
      <template v-if="!clears.includes(lIndex)" >
        <div class="cell" v-for="(cell, cIndex) in line" :key="`line-${lIndex}-cell-${cIndex}`">
          <div v-if="cell.hasBlock" class="block" :style="getStyle(cell)"></div>
        </div>
      </template>
      <template v-else>
        <div class="cell cell-cleared"
          :class="{ 'cell-clearing': clearing }" 
          v-for="(cell, cIndex) in line" 
          :key="`line-${lIndex}-cell-${cIndex}`">
        </div>
        <div class="message" v-text="message"></div>
      </template>
    </div>
  </div>
</template>

<script>
import Clock from './clock'
import grid from './grid'
import { chooseBlock } from './block'
import { KeyboardListener, Keys } from './keyboard'
import encouragement from './encouragement'

const startingSpeedInMs = 700

export default {
  data() {
    return {
      clearing: false,
      clears: [],
      clock: null,
      grid: null,
      keyboardListener: null,
      message: ''
    }
  },
  mounted() {
    this.grid = grid.grid

    this.clock = new Clock(startingSpeedInMs)
    this.clock.subscribe(() => this.tick())

    this.keyboardListener = new KeyboardListener()
    this.keyboardListener.subscribe(Keys.Left, () => {
      grid.moveCurrentBlockLeft()
    })
    this.keyboardListener.subscribe(Keys.Right, () => {
      grid.moveCurrentBlockRight()
    })
    this.keyboardListener.subscribe(Keys.Up, () => {
      grid.rotateCurrentBlock()
    })
    this.keyboardListener.subscribe(Keys.Down, () => {
      this.clock.pause()
      grid.forceSettle(() => this.clock.resume())
    })
    this.keyboardListener.subscribe(Keys.Space, () => {
      if (this.clock.isPaused()) {
        this.clock.resume()
      } else {
        this.clock.pause()
      }
    })
  },
  methods: {
    beginClearLines(clears, callback) {
      if (!clears.length) {
        callback()
        return
      }

      this.$emit('line-cleared')

      this.clock.pause()

      this.message = ''
      this.clears = clears
      setTimeout(() => {
        this.clearing = true
        this.getEncouragement()
      }, 100)
      setTimeout(() => {
        const clears = this.clears
        this.clears = []
        grid.clearLines(clears, () => {
          this.clearing = false
          callback()
          this.clock.resume()
        })
      }, 1000)
    },
    getEncouragement() {
      const randomIndex = Math.floor(Math.random() * encouragement.length)
      this.message = encouragement[randomIndex] + '!'
    },
    getStyle(cell) {
      return {
        'background-color': cell.color
      }
    },
    nextBlock() {
      const block = chooseBlock()
      const canCreate = grid.createBlock(block)
      if (!canCreate) {
        console.log('cannot create block')
        this.beginClearLines([this.grid.length - 1, this.grid.length - 2], () => this.nextBlock())
      }      
    },
    tick() {
      const settled = grid.isSettled()
      if (!settled) {
        grid.exertGravity()
      } else {
        const clears = grid.getLineClears()
        this.beginClearLines(clears, () => this.nextBlock())
      }
    }
  },
  destroyed() {
    this.clock.destroy()
    this.keyboardListener.destroy()
  }
}
</script>

<style scoped>
.grid {
  border: 3px solid rgba(173,216,230, 0.7);
}

.line {
  display: flex;
  flex-direction: row;
  position: relative;
}

.cell {
  box-shadow: inset 10px 10px 24px -19px rgba(0,0,0,0.6),
    inset -10px -10px 24px -19px rgba(255,255,255,0.6);
  height: 30px;
  position: relative;
  width: 30px;
}

.cell.cell-cleared {
  background-color: silver;
  box-shadow: inset 10px 10px 24px -19px rgba(0,0,0,0.75),
    inset -10px -10px 24px -19px rgba(255,255,255,1);
  transition: background-color 500ms, box-shadow 500ms;
}

.cell.cell-cleared.cell-clearing {
  background-color: rgba(173,216,230, 0.4);
  box-shadow: none;
}

.block {
  background-color: green;
  box-shadow: inset 10px 10px 24px -19px rgba(0,0,0,0.75),
    inset -10px -10px 24px -19px rgba(255,255,255,1);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 2;
}

.message {
  align-items: center;
  bottom: 0;
  display: flex;
  font-family: Georgia, 'Times New Roman', Times, serif;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

</style>