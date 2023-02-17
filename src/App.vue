<template>
  <Scene/>
  <div class="bg"></div>
  <router-view style="z-index: 1"></router-view>
</template>

<script setup lang="ts">
import Scene from '@/views/Scene.vue'
import router from '@/router/index'

router.push("/")
</script>


<style scoped>
:global(#app) {
  width: 100vw;
  height: 100vh;
  background-color: #999;
  color: #FFF;
  pointer-events: none;
}

.bg {
  position: fixed;
  height: 100vh;
  width: 100vw;
  /* z-index: 1;
  background: url('@/assets/img/首页.png') center / 100% 100% no-repeat; */
}
</style>
