<script setup>
import {
  reactive,
  ref,
  toRefs,
  onBeforeMount,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from "vue";
import * as echarts from "echarts";
import { debounce, throttle, echartsRotation } from "@/utils/utils";
let myChart = null;
const echartsData = ref(null);
const option = {
  title: {
    text: "饼图程序调用高亮示例",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 135, name: "视频广告" },
        { value: 1548, name: "搜索引擎" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

onMounted(() => {
  console.log("this", this);
  myChart = echarts.init(echartsData.value);
  myChart.setOption(option);
  echartsRotation(myChart, option);
});
</script>
<template>
  <div class="echarts" ref="echartsData"></div>
</template>

<style scoped lang ='scss'>
.echarts {
  width: 500px;
  height: 500px;
  margin: 200px auto;
}
</style>