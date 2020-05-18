<template>
  <div class="wrap">
    <div>
      <Key text="⬅"></Key>
      <Key text="➡"></Key>
      Move
    </div>
    <div>
      <Key text="⬆"></Key>
      Rotate
    </div>
    <div>
      <Key text="⬇"></Key>
      Drop
    </div>
  </div>
</template>

<script>
import Key from './Key.vue'

export default {
  components: {
    Key
  }
}
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.wrap > div {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 8px;
}
</style>