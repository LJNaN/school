<template>
  <Scene />
  <div class="bg">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Scene from "@/views/Scene.vue";
import router from "@/router/index";
import Home from "@/views/Home.vue";
router.push("/SmartSchool");
</script>


<style scoped>
:global(#app) {
  width: 100vw;
  height: 100vh;
  background-color: #999;
  color: #fff;
  pointer-events: none;
}

.bg {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  /* background: url("/assets/2d/img/1.png"); */
  background-size: 100% 100%;
}
</style>
