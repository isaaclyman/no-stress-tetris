<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <h2>No Stress Tetris</h2>
      </div>
      <div class="body">
        <div class="score"></div>
        <div class="game">
          <Game></Game>
          <Instructions></Instructions>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Game from './components/Game.vue'
import Instructions from './components/Instructions.vue'

export default {
  name: 'App',
  components: {
    Game,
    Instructions
  }
}
</script>

<style>
#app {
  color: #2c3e50;
  display: flex;
  flex-direction: row;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  justify-content: center;
  margin: 15px auto;
  text-align: center;
}

.body {
  display: flex;
}
</style>
