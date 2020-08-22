<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
.app {
  margin: 20px;
  min-width: 720px;
  font-size: 12px;
  color: #333;
}
</style>
