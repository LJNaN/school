<script setup>
import {
  reactive,
  ref,
  toRefs,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from "vue";
import * as echarts from "echarts";
const echartsData = ref(null);
const option = {};
</script>
<template>
  <div class="echarts" ref="echartsData"></div>
</template>

<style scoped lang ='scss'>
.echarts {
  width: 500px;
  height: 500px;
  margin: 200px auto;
  border: 1px solid red;
}
</style>