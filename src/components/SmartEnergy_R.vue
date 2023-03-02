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
const warningMessageData = [];
for (let i = 0; i < 7; i++) {
  warningMessageData.push({
    id: "渝高1554",
    class: "清洁车",
    warningMessage: "XX告警",
    time: "2023/01/16",
  });
}

//能源消耗
const energyConsumeData = ref(null);
let energyStateEchart = null;
let dataE = reactive([
  { name: "配电室1", value: "30" },
  { name: "配电室2", value: "70" },
]);
const energyConsumeOption = reactive({
  color: ["#3baaff", "#ffdf00"],
  tooltip: {},
  legend: {
    orient: "vertical",
    right: 0,
    itemWidth: 3,
    itemHeight: 3,
    icon: "circle",
    itemGap: 10,
    textStyle: {
      color: "#ffffff",
    },
  },
  series: [
    // 外边设置
    {
      type: "pie",
      center: ["50%", "50%"],
      radius: ["50%", "60%"], // 数组的第一项是内半径、第二项是外半径
      itemStyle: {
        color: "rgba(206,213,225,0.01)",
      },
      label: {
        show: false,
      },
      data: [],
    },

    // 展示层
    {
      type: "pie",
      center: ["50%", "50%"],
      radius: ["30%", "50%"],
      itemStyle: {
        borderWidth: 1, //描边线宽
        borderColor: "#fff",
      },
      label: {
        show: false,
      },
      data: dataE,
    },
  ],
});

//园区能耗态势
const energyStateData = ref(null);
let energyConsumeEcharts = null;
let dataD = ref([32, 36, 22, 33, 21, 43, 19, 34, 39, 35, 38, 42, 30, 3]);
let dataS = ref([11, 33, 11, 22, 33, 22, 33, 21, 43, 19, 42, 30, 32, 23]);
let dataQ = ref([25, 22, 26, 28, 27, 26, 23, 22, 33, 22, 33, 21, 43, 19]);
const energyStateOption = reactive({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["耗电", "耗气", "耗水"],
    textStyle: {
      color: "#fff",
    },
  },
  grid: {
    // top: "middle",
    left: 10,
    right: 20,
    bottom: 20,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: true,

    calculable: false,
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    axisTick: {
      show: true, //隐藏X轴刻度
    },
    axisLabel: {
      show: true,
      fontSize: 10,
      textStyle: {
        color: "#ebf8ac", //X轴文字颜色
      },
      interval: 0,
    },
  },

  yAxis: {
    axisLabel: {
      formatter: "{value}℃",
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: "#ebf8ac",
      },
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "#DDD",
      },
    },
  },

  series: [
    {
      name: "耗电",
      type: "line",
      min: 10,
      max: 40,
      data: dataD,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: {
            type: "linear",
            colorStops: [
              {
                offset: 0,
                color: "#AAF487", // 0% 处的颜色
              },
              {
                offset: 0.4,
                color: "#47D8BE", // 100% 处的颜色
              },
              {
                offset: 1,
                color: "#47D8BE", // 100% 处的颜色
              },
            ],
          },
        },
      },
      itemStyle: {
        borderWidth: 0,
      },
      smooth: true,
    },
    {
      name: "耗气",
      type: "line",
      min: 10,
      max: 40,
      data: dataQ,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: {
            type: "linear",

            colorStops: [
              {
                offset: 0,
                color: "#EEEE00", // 0% 处的颜色
              },
              {
                offset: 0.4,
                color: "#FFFF00", // 40% 处的颜色
              },
              {
                offset: 1,
                color: "#FFFF33", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
        },
      },
      itemStyle: {
        normal: {
          color: "#F6D06F",
          borderWidth: 10,
          borderColor: "#F6D06F",
        },
      },
      smooth: true,
    },
    {
      name: "耗水",
      type: "line",
      min: 10,
      max: 40,
      data: dataS,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: {
            type: "linear",

            colorStops: [
              {
                offset: 0,
                color: "#DDAA00", // 0% 处的颜色
              },
              {
                offset: 0.4,
                color: "#FFCC00", // 100% 处的颜色
              },
              {
                offset: 1,
                color: "#FFCC22", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
        },
      },
      itemStyle: {
        normal: {
          color: "#F6D06F",
          borderWidth: 10,
          borderColor: "#F6D06F",
        },
      },
      smooth: true,
    },
  ],
});

const timer = setInterval(() => {
  dataE[0].value = Math.ceil(Math.random() * 100);
  dataE[1].value = 100 - dataE[0].value;

  dataD.value = dataD.value.map(() => Math.ceil(Math.random() * 50));
  dataS.value = dataS.value.map(() => Math.ceil(Math.random() * 50));
  dataQ.value = dataQ.value.map(() => Math.ceil(Math.random() * 50));
  if (energyConsumeEcharts != null) {
    energyConsumeEcharts.setOption(energyConsumeOption);
  }
  if (energyStateEchart != null) {
    energyStateEchart.setOption(energyStateOption);
  }
}, 2000);

onMounted(() => {
  energyStateEchart = echarts.init(energyStateData.value);
  energyStateEchart.setOption(energyStateOption);

  energyConsumeEcharts = echarts.init(energyConsumeData.value);
  energyConsumeEcharts.setOption(energyConsumeOption);
  window.addEventListener("resize", () => {
    energyStateEchart.resize();
    energyConsumeEcharts.resize();
  });
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
<template>
  <div class="right">
    <Container title="能源分类消耗">
      <div class="energyConsume">
        <div class="energybody">
          <div class="leftBlock">
            <p>配电室1</p>
            <div class="yellow">4,458<span>(kw·h)</span></div>
            <p>配电室2</p>
            <div class="blue">4,458<span>(kw·h)</span></div>
          </div>
          <div class="energyConsumeEchart" ref="energyConsumeData"></div>
        </div>
        <div class="btn">
          <div class="btnleft"><span>查看能源流向</span></div>
          <div class="btncenter"><span>配电室1</span></div>
          <div class="btnright"><span>配电室2</span></div>
        </div>
      </div>
    </Container>
    <Container title="园区能耗态势">
      <div class="energyState" ref="energyStateData"></div>
    </Container>
    <Container title="告警信息">
      <div class="warningMessage">
        <ul>
          <li>
            <span>序号</span>
            <span>车牌号</span>
            <span>车类</span>
            <span>告警信息</span>
            <span>时间</span>
          </li>
          <li v-for="(item, index) in warningMessageData" :key="index">
            <span
              ><div>{{ index + 1 }}</div></span
            >
            <span>{{ item.id }}</span>
            <span>{{ item.class }}</span>
            <span>{{ item.warningMessage }}</span>
            <span>{{ item.time }}</span>
          </li>
        </ul>
      </div>
    </Container>
  </div>
</template>

<style scoped lang ='scss'>
.right {
  width: vw(380);
  height: vh(993);
  position: absolute;
  top: vh(56);
  right: vw(10);
  .energyConsume {
    margin: vh(20) 0 vh(58) 0;
    .energybody {
      display: flex;
      justify-content: space-around;
      .leftBlock {
        text-align: center;
        p {
          font-size: rem(14);
          margin-bottom: vh(3);
        }
        .yellow {
          width: vw(163);
          height: vh(54);
          background: url("/assets/2d/img/能源分类消耗Y@2x.png");
          background-size: 100% 100%;
          font-size: rem(27);
          line-height: 54px;
          color: #ffdf00ff;
          span {
            font-size: rem(14);
          }
        }
        .blue {
          width: vw(163);
          height: vh(54);
          font-size: rem(27);
          line-height: 54px;
          color: #3baaffff;
          background: url("/assets/2d/img/能源分类消耗B@2x.png");
          background-size: 100% 100%;
          span {
            font-size: rem(14);
          }
        }
      }
      .energyConsumeEchart {
        width: vw(160);
        height: vh(160);
      }
    }
    .btn {
      display: flex;
      justify-content: space-around;
      text-align: center;
      .btnleft {
        width: vw(74);
        height: vh(17);
        background: url("/assets/2d/img/btnleft@2x.png");
        background-size: 100% 100%;
        span {
          display: block;
          font-size: rem(12);
          scale: 0.87;
        }
      }
      .btncenter {
        width: vw(70);
        height: vw(17);
        background: url("/assets/2d/img/btncenter@2x.png");
        background-size: 100% 100%;
        span {
          display: block;
          font-size: rem(12);
          scale: 0.87;
        }
      }
      .btnright {
        width: vw(74);
        height: vh(17);
        background: url("/assets/2d/img/btnright@2x.png");
        background-size: 100% 100%;
        span {
          display: block;
          font-size: rem(12);
          scale: 0.87;
        }
      }
    }
  }
  .energyState {
    width: vw(358);
    height: vh(260);
  }
  .warningMessage {
    margin-top: vh(19);
    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
      gap: vh(6);
      font-size: rem(12.78);
      li {
        width: 100%;
        height: vh(34);
        background: url("/assets/2d/img/矩形560拷贝6@2x.png");
        background-size: 100% 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        span {
          width: 20%;
          text-align: center;
        }
        span:first-child {
          width: 10%;
          display: flex;
          justify-content: center;
          div {
            padding: 0.2rem 0.4rem;
            background: #2f3747;
            border-radius: vh(2);
            margin: 0;
          }
        }
      }
      li:nth-child(5) {
        span :first-child {
          color: #1fadffff;
        }
      }
    }
  }
}
</style>

