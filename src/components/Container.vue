<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
const props = defineProps({ title: String });
</script>
<template>
  <div>
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<style scoped lang ='scss'>
.title {
  pointer-events: all;
  width: vw(204);
  height: vh(28);
  margin: 0 auto;
  font-size: rem(18);
  text-align: center;
  background: url("/assets/2d/img/标题框@2x.png");
  background-size: 100% 100%;
}
</style>