<template>
  <div class="grid">
    <div class="line" v-for="(line, lIndex) in grid" :key="`line-${lIndex}`">
      <div class="cell" v-for="(cell, cIndex) in line" :key="`line-${lIndex}-cell-${cIndex}`">
        <div v-if="cell" class="block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import clock from './clock'
import grid, { isSettled, exertGravity, createBlock } from './grid'
import { chooseBlock } from './block'

const startingSpeedInMs = 600

export default {
  data() {
    return {
      clock: null,
      grid
    }
  },
  mounted() {
    this.clock = new clock(startingSpeedInMs)
    this.clock.subscribe(() => this.tick())
  },
  methods: {
    tick() {
      console.log('tick')
      const settled = isSettled(grid)
      if (!settled) {
        exertGravity(grid)
      } else {
        const block = chooseBlock()
        createBlock(grid, block)
      }

      // check for line clears
    }
  },
  destroyed() {
    this.clock.destroy()
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
}

.cell {
  box-shadow: inset 10px 10px 24px -19px rgba(0,0,0,0.75),
    inset -10px -10px 24px -19px rgba(255,255,255,1);
  height: 30px;
  position: relative;
  width: 30px;
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
</style>