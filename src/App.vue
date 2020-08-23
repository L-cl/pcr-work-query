<template>
  <div id="app" class="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="less" scoped>
.app {
  margin: 20px;
  min-width: 720px;
  font-size: 12px;
  color: #333;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.fade-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}
.fade-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}
</style>
