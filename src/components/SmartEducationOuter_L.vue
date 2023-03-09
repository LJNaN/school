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
//教学情况查看数据
const teachSituationData = [
  {
    name: "上课教师人数",
    value: "282",
    imgUrl: "./assets/2d/img/smartEducationOuter/8.png",
  },
  {
    name: "上课学生人数",
    value: "290",
    imgUrl: "./assets/2d/img/smartEducationOuter/8.png",
  },
  {
    name: "涉及课程门类",
    value: "302",
    imgUrl: "./assets/2d/img/smartEducationOuter/9.png",
  },
  {
    name: "授课学院数量",
    value: "322",
    imgUrl: "./assets/2d/img/smartEducationOuter/10.png",
  },
];
//停车场占用率数据
const parkingUsageData = ref(null);
let parkdata = ref([80, 60, 100, 85, 70, 90]);
let parkingUsageEchart = null;
const parkingUsageOption = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      lineStyle: {
        color: "rgb(126,199,255)",
      },
    },
  },
  legend: {
    show: true,
    top: 0,
    height: 300,
    itemWidth: 30, // 图例标记的图形宽度。
    //   itemGap: 20, // 图例每项之间的间隔。
    itemHeight: 10, //  图例标记的图形高度。
    textStyle: {
      color: "#fff",
      fontSize: 14,
      padding: [0, 8, 0, 8],
    },
  },
  grid: {
    top: "10%",
    left: "10%",
    right: "5%",
    bottom: "10%",
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLine: {
        //坐标轴轴线相关设置。数学上的x轴
        show: true,
        lineStyle: {
          color: "rgb(41,188,245)",
        },
      },
      axisLabel: {
        //坐标轴刻度标签的相关设置
        textStyle: {
          color: "#FFFFFF",
          fontSize: 12,
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "#233653",
        },
      },
      axisTick: {
        show: false,
      },
      data: ["01-01", "01-02", "01-03", "01-04", "01-05", "01-06"],
    },
  ],
  yAxis: [
    {
      name: "",
      nameTextStyle: {
        color: "#fff",
        fontSize: 12,
        padding: [0, 60, 0, 0],
      },
      // minInterval: 1,
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: "#1160a0",
          type: "dashed",
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#008de7",
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#fff",
          fontSize: 14,
        },
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      data: parkdata,
      type: "line",
      symbolSize: 0,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0.0, color: "rgba(54, 222, 221,1)" },
            { offset: 0.5, color: "rgba(54, 222, 221,.5)" },
            { offset: 1, color: "rgba(54, 222, 221,0.3)" },
          ]),
        },
      },
      itemStyle: {
        normal: {
          lineStyle: {
            color: "rgba(54, 222, 221,1)",
          },
        },
      },
    },
  ],
});

//会议室使用情况数据
const roomUsageData = [];
for (let i = 0; i < 32; i++) {
  roomUsageData.push({
    name: "1F",
    imgUrl: `./assets/2d/img/smartEducationOuter/room${Math.ceil(
      Math.random() * 3
    )}.png`,
  });
}

//echats动态和自适应
let timer = setInterval(() => {
  parkdata.value = parkdata.value.map(() => 40 + Math.ceil(Math.random() * 50));
  if (parkingUsageEchart != null) {
    parkingUsageEchart.setOption(parkingUsageOption);
  }
}, 2000);
function echartsResize() {
  parkingUsageEchart.resize();
}
onMounted(() => {
  parkingUsageEchart = echarts.init(parkingUsageData.value);
  parkingUsageEchart.setOption(parkingUsageOption);
  window.addEventListener("resize", echartsResize);
});
onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", echartsResize);
});
</script>
<template>
  <div class="left">
    <Container title="教学情况查看">
      <div class="teachSituation">
        <ul>
          <li v-for="(item, index) in teachSituationData" :key="index">
            <img :src="item.imgUrl" alt="" />
            <div>
              <p class="value">{{ item.value }}</p>
              <p>{{ item.name }}</p>
            </div>
          </li>
        </ul>
      </div>
    </Container>
    <Container title="停车场占用率">
      <div class="parkingUsage">
        <div class="title">
          <div class="titleLeft"><span>开课教师数量</span></div>
          <div class="titleCenter"><span>开课数量</span></div>
          <div class="titleRight"><span>访问人数</span></div>
        </div>
        <div class="parkingUsageEchart" ref="parkingUsageData"></div>
      </div>
    </Container>
    <Container title="会议室使用情况">
      <div class="roomUsage">
        <div class="title">
          <div>
            <p>可用</p>
            <div class="blueBar"></div>
          </div>
          <div>
            <p>不可用</p>
            <div class="OrangeBar"></div>
          </div>
          <div>
            <p>待开放</p>
            <div class="grayBar"></div>
          </div>
        </div>
        <ul>
          <li
            v-for="(item, index) in roomUsageData"
            :key="index"
            :style="{
              background: `url(${item.imgUrl})`,
              backgroundSize: '100% 100%',
            }"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </Container>
  </div>
</template>

<style scoped lang ='scss'>
.left {
  pointer-events: all;
  width: vw(380);
  height: vh(993);
  position: absolute;
  top: vh(56);
  left: vw(10);
  .teachSituation {
    margin: vh(30) 0 vh(78) 0;
    ul {
      display: flex;
      flex-wrap: wrap;
      li:nth-child(1),
      li:nth-child(2) {
        margin-bottom: vh(40);
      }
      li {
        width: 50%;
        display: flex;
        font-size: rem(12);
        justify-content: center;

        img {
          width: vw(52);
          height: vh(51);
        }
        div {
          margin-left: vw(9);
          .value {
            font-size: rem(20);
            color: #17b0ffff;
            margin-bottom: vh(5);
          }
        }
      }
    }
  }
  .parkingUsage {
    .title {
      display: flex;
      justify-content: space-around;
      margin-top: vh(33);
      font-size: rem(12);
      .titleLeft {
        background: url("/assets/2d/img/smartEducationOuter/btnleft@2x.png");
        background-size: 100% 100%;
      }
      .titleCenter {
        background: url("/assets/2d/img/smartEducationOuter/btncenter@2x.png");
        background-size: 100% 100%;
      }
      .titleRight {
        background: url("/assets/2d/img/smartEducationOuter/btnright@2x.png");
        background-size: 100% 100%;
      }
      span {
        display: block;
        font-size: rem(12);
        scale: 0.8;
      }
    }
    .parkingUsageEchart {
      height: 200px;
      margin: 0 0 vh(60) 0;
    }
  }

  .roomUsage {
    .title {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: vh(35);
      p {
        text-align: center;
        margin-bottom: vh(13);
      }
      .blueBar {
        width: vh(98);
        height: vh(2);
        border: vh(2) solid #17b0ff;
      }
      .OrangeBar {
        width: vh(98);
        height: vh(2);
        border: vh(2) solid #ff842a;
      }
      .grayBar {
        width: vh(98);
        height: vh(2);
        border: vh(2) solid #dbdbdb;
      }
    }
    ul {
      display: grid;
      gap: vw(12);
      grid-template-columns: repeat(8, vw(31));
      place-content: center;
      margin-top: vh(28);
      li {
        height: vh(31);
        text-align: center;
        line-height: vh(31);
      }
    }
  }
}
</style>
