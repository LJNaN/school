<script setup >
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import Head from "@/components/Head.vue";
import Foot from "@/components/Foot.vue"
import IconTitle from '@/components/IconTitle.vue'
import SmartSecurity_L from "@/components/SmartSecurity_L.vue";
import SmartSecurity_R from "@/components/SmartSecurity_R.vue";
const leftRef = ref(null);

onMounted(() => {
  // let myChart = echarts.init(leftRef.value);
  // let option = {
  //   xAxis: {
  //     type: "category",
  //     data: [
  //       "星期一",
  //       "星期二",
  //       "星期三",
  //       "星期四",
  //       "星期五",
  //       "星期六",
  //       "星期日",
  //     ],
  //   },
  //   yAxis: {
  //     type: "value",
  //   },
  //   series: [
  //     {
  //       data: [150, 230, 224, 218, 135, 147, 260],
  //       type: "line",
  //     },
  //   ],
  //   tooltip: {
  //     trigger: "axis",
  //   },
  // };
  // myChart.setOption(option);
});
</script>

<template>
  <div class="home">
    <Head></Head>
    <Foot></Foot>
    <SmartSecurity_L></SmartSecurity_L>
    <SmartSecurity_R></SmartSecurity_R>
    <IconTitle></IconTitle>
  </div>
</template>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  z-index: 2;
  position: absolute;
  pointer-events: all;
}
</style>
