<script setup>
import {
  reactive,
  ref,
  toRefs,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from "vue";
import Container from "./Container.vue";
import * as echarts from "echarts";
const todayPowerEchartsData = ref(null);
const todayPowerData = [
  {
    name: "照明设备",
    value: "426",
    imgUrl: "./assets/2d/img/smartEnergy/1.png",
    Echarts: "",
  },
  {
    name: "空调设备",
    value: "426",
    imgUrl: "./assets/2d/img/smartEnergy/2.png",
    Echarts: "",
  },
  {
    name: "显示设备",
    value: "426",
    imgUrl: "./assets/2d/img/smartEnergy/3.png",
    Echarts: "",
  },
  {
    name: "插座",
    value: "426",
    imgUrl: "./assets/2d/img/smartEnergy/4.png",
    Echarts: "",
  },
];
//今日耗电echarts
let todayPowerEcharts1 = null;
let todayPowerEcharts2 = null;
let todayPowerEcharts3 = null;
let todayPowerEcharts4 = null;
const dataY = ref([
  1, 5, 7, 12, 4, 16, 2, 8, 5, 9, 16, 18, 14, 17, 9, 14, 4, 13, 10, 9,
]);
const option = reactive({
  grid: {
    left: "3%",
    top: "3%",
    bottom: "3%",
    containLabel: true,
  },

  xAxis: {
    data: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],
    boundaryGap: false,
    axisLabel: false,
    axisTick: false,
  },
  yAxis: {
    axisLabel: false,
    splitLine: false,
  },
  series: [
    {
      data: dataY,
      type: "line",
      symbolSize: 0,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0.0, color: "rgba(35, 112, 173,1)" },
            { offset: 0.5, color: "rgba(35, 112, 173,.5)" },
            { offset: 1, color: "rgba(35, 112, 173,0.3)" },
          ]),
        },
      },
    },
  ],
});

//消防检测echarts
const energyConsumeData = ref(null);
let energyConsumeEcharts = null;
let dataB = ref([820, 1750, 2100, 3150, 3300, 3450, 4200]);
const energyConsumeOption = reactive({
  // backgroundColor: "#051C43",
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(18, 57, 60, .8)", //设置背景颜色
    textStyle: {
      color: "#fff",
    },
    borderColor: "rgba(18, 57, 60, .8)",
    axisPointer: {
      type: "shadow",
      shadowStyle: {
        color: "rgba(0, 11, 34, .2)",
      },
    },
  },
  grid: {
    x: 65,
    y: 40,
    x2: 20,
    y2: 20,
    top: "2%",
    right: "15%",
    bottom: "12%",
  },
  xAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#284685",
      },
    },

    axisLabel: {
      textStyle: {
        color: "#DEEBFF",
        fontSize: 12,
      },
    },
    show: true,
    type: "value",
    axisTick: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(40, 70, 133, .3)",
        type: "solid",
      },
    },
  },
  yAxis: [
    {
      type: "category",
      data: [
        "教室1101",
        "教室1102",
        "教室1103",
        "教室1104",
        "教室1105",
        "教室1108",
      ],
      axisLine: {
        lineStyle: {
          color: "#284685",
        },
      },
      axisLabel: {
        textStyle: {
          color: "#DEEBFF",
          fontSize: 12,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: "",
      type: "bar",
      barWidth: 9,
      data: dataB,
      // barCategoryGap:"20%",
      itemStyle: {
        normal: {
          barBorderRadius: [0, 20, 20, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "rgba(1, 255, 255, 1)", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(2, 127, 255, 1)", // 100% 处的颜色
            },
          ]),
        },
      },
    },
  ],
});

//echarts动态和自适应
const timer = setInterval(() => {
  dataY.value = dataY.value.map(() => Math.ceil(Math.random() * 20));
  dataB.value = dataB.value.map(() => 1000 + Math.ceil(Math.random() * 3000));
  // dataS.value = dataS.value.map(() => Math.ceil(Math.random() * 50));
  // dataQ.value = dataQ.value.map(() => Math.ceil(Math.random() * 50));
  if (todayPowerEcharts1 != null) {
    todayPowerEcharts1.setOption(option);
  }
  if (todayPowerEcharts2 != null) {
    todayPowerEcharts2.setOption(option);
  }
  if (todayPowerEcharts3 != null) {
    todayPowerEcharts3.setOption(option);
  }
  if (todayPowerEcharts4 != null) {
    todayPowerEcharts4.setOption(option);
  }
  if (energyConsumeEcharts != null) {
    energyConsumeEcharts.setOption(energyConsumeOption);
  }
}, 2000);

function echartsResize() {
  todayPowerEcharts1.resize();
  todayPowerEcharts2.resize();
  todayPowerEcharts3.resize();
  todayPowerEcharts4.resize();

  energyConsumeEcharts.resize();
}

onMounted(() => {
  todayPowerEcharts1 = echarts.init(todayPowerEchartsData.value[0]);
  todayPowerEcharts1.setOption(option);
  todayPowerEcharts2 = echarts.init(todayPowerEchartsData.value[1]);
  todayPowerEcharts2.setOption(option);
  todayPowerEcharts3 = echarts.init(todayPowerEchartsData.value[2]);
  todayPowerEcharts3.setOption(option);
  todayPowerEcharts4 = echarts.init(todayPowerEchartsData.value[3]);
  todayPowerEcharts4.setOption(option);

  energyConsumeEcharts = echarts.init(energyConsumeData.value);
  energyConsumeEcharts.setOption(energyConsumeOption);

  window.addEventListener("resize", echartsResize);
});
onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", echartsResize);
});
</script>
<template>
  <div class="left">
    <Container title="能源管理">
      <div class="energyManage">
        <div>
          <p class="value">1253</p>
          <img :src="'./assets/2d/img/3.png'" />
          <P class="name">水能消耗(ML)</P>
        </div>
        <div>
          <p class="value">1253</p>
          <img :src="'./assets/2d/img/4.png'" />
          <P class="name">电能消耗(KW)</P>
        </div>
      </div>
    </Container>
    <Container title="今日耗电">
      <div class="todayPowerConsume">
        <ul>
          <li v-for="(item, index) in todayPowerData" :key="index">
            <div class="title">
              <span>{{ item.name }}</span
              ><span>{{ item.value }} W/H</span>
            </div>
            <div class="echart">
              <img :src="item.imgUrl" />
              <div class="todayPowerEcharts" ref="todayPowerEchartsData"></div>
            </div>
          </li>
        </ul>
      </div>
    </Container>
    <Container title="能量消耗排名">
      <div class="energyConsumeRank" ref="energyConsumeData"></div>
    </Container>
  </div>
</template>

<style scoped lang ='scss'>
.left {
  pointer-events: all;
  width: vw(380);
  height: vh(993);
  position: absolute;
  left: vw(10);
  top: vh(56);
  .energyManage {
    height: 100px;
    margin: vh(51) 0 vh(67) 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .value {
      font-size: rem(25);
      text-align: center;
    }
    img {
      width: vw(131);
      height: vh(83);
    }

    .name {
      font-size: rem(15);
      text-align: center;
    }
  }
  .todayPowerConsume {
    margin: vh(29) 0 vh(30) 0;
    ul {
      display: flex;
      flex-wrap: wrap;
      font-size: rem(14.85);
      gap: vh(7);
      padding: vw(12);
      li {
        width: 100%;
        // height: vh(69);
        .title {
          display: flex;
          justify-content: space-between;
        }
        .echart {
          display: flex;
          flex-wrap: wrap;
          img {
            width: vw(50);
            height: vh(50);
          }
          .todayPowerEcharts {
            width: vw(297);
            height: vh(50);
          }
        }
      }
    }
  }

  .energyConsumeRank {
    margin: vh(28) vw(17);
    width: vw(378);
    height: vh(258);
  }
}
</style>