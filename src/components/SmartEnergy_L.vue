<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import Container from "./Container.vue";
import * as echarts from "echarts";
const todayPowerEchartsData = ref(null);
const todayPowerData = [
  {
    name: "照明设备",
    value: "426",
    imgUrl: "/assets/2d/img/照明设备@2x.png",
    Echarts: "",
  },
  {
    name: "空调设备",
    value: "426",
    imgUrl: "/assets/2d/img/空调设备@2x.png",
    Echarts: "",
  },
  {
    name: "显示设备",
    value: "426",
    imgUrl: "/assets/2d/img/显示设备@2x.png",
    Echarts: "",
  },
  {
    name: "插座",
    value: "426",
    imgUrl: "/assets/2d/img/插座设备@2x.png",
    Echarts: "",
  },
];
const dataY = [];
for (let i = 0; i <= 20; i++) {
  dataY.push(Math.ceil(Math.random() * 10));
}
const dataX = [];
for (let i = 0; i < 20; i++) {
  dataX.push(`${i}`);
}
const option = {
  grid: {
    left: "3%",
    top: "3%",
    bottom: "3%",
    containLabel: true,
  },

  xAxis: {
    data: dataX,
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
};

//消防检测echarts
const energyConsumeData = ref(null);
const energyConsumeOption = {
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
      data: [820, 1750, 2100, 3150, 3300, 3450, 4200],
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
};

onMounted(() => {
  var todayPowerEcharts1 = echarts.init(todayPowerEchartsData.value[0]);
  todayPowerEcharts1.setOption(option);
  var todayPowerEcharts2 = echarts.init(todayPowerEchartsData.value[1]);
  todayPowerEcharts2.setOption(option);
  var todayPowerEcharts3 = echarts.init(todayPowerEchartsData.value[2]);
  todayPowerEcharts3.setOption(option);
  var todayPowerEcharts4 = echarts.init(todayPowerEchartsData.value[3]);
  todayPowerEcharts4.setOption(option);

  const energyConsumeEcharts = echarts.init(energyConsumeData.value);
  energyConsumeEcharts.setOption(energyConsumeOption);

  window.addEventListener("resize", () => {
    todayPowerEcharts1.resize();
    todayPowerEcharts2.resize();
    todayPowerEcharts3.resize();
    todayPowerEcharts4.resize();

    energyConsumeEcharts.resize();
  });
});
</script>
<template>
  <div class="left">
    <Container title="能源管理">
      <div class="energyManage">
        <div>
          <p class="value">1253</p>
          <img src="assets/2d/img/水能@2x.png" />
          <P class="name">水能消耗(ML)</P>
        </div>
        <div>
          <p class="value">1253</p>
          <img src="assets/2d/img/电能@2x.png" />
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