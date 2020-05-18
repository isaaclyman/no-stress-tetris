<template>
  <div class="wrap">
    <div class="key" v-text="text"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    text: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped>
.wrap {
  background-color: rgba(173,216,230, 0.3);
  border: 3px solid rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  display: inline-block;
  height: 30px;
  margin-right: 12px;
  width: 30px;
}

.key {
  align-items: center;
  display: flex;
  font-size: 26px;
  height: 100%;
  justify-content: center;
  width: 100%;
}

</style>