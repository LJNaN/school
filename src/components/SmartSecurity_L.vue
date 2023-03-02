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

//学校访客echarts
const visitorData = ref(null);
let visitorEchart = null;
let vdata = ref([30, 35, 101, 40, 32, 48, 19]);
const visitorOption = reactive({
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(17,95,182,0.5)",
    textStyle: {
      color: "#fff",
    },
    triggerOn: "mousemove",
    showContent: true,
  },
  title: {
    left: 26,
    top: 26,
    textStyle: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: 50000,
      fontFamily: "PingFang SC",
    },
  },
  grid: {
    left: "5%",
    bottom: 0,
    top: "5%",
    containLabel: true,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: "#fefefe",
      },
    },
    splitLine: {
      show: false,
    },
    axisTick: {
      show: true,
    },
    //轴线上的字
    axisLabel: {
      show: true,
      textStyle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: "14",
      },
    },
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: [
    {
      type: "value",
      splitNumber: 4,
      axisTick: {
        show: false,
      },
      //轴线上的字
      axisLabel: {
        show: true,
        textStyle: {
          fontSize: "14",
          color: "rgba(255,255,255,0.8)",
        },
      },
      axisLine: {
        lineStyle: {
          color: "#397cbc",
        },
      },
      //网格线
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#11366e",
        },
      },
    },
  ],
  series: [
    {
      name: "访客",
      type: "line",
      smooth: true, //是否平滑曲线显示
      showSymbol: false,
      markPoint: {
        data: [
          {
            name: "周最高",
            value: 320,
            xAxis: 4,
            yAxis: 320,
          },
        ],
      },
      itemStyle: {
        color: "#e5c800",
        borderColor: "#d0b701",
        borderWidth: 1,
      },
      lineStyle: {
        normal: {
          width: 2,
          color: {
            type: "linear",
            colorStops: [
              {
                offset: 0,
                color: "#F3A22D", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#F3A22D", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          shadowColor: "#F3A22D",
          shadowBlur: 30,
          shadowOffsetY: 5,
        },
      },
      areaStyle: {
        //区域填充样式
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "#e4c701",
              },
              {
                offset: 0.6,
                color: "#322c09",
              },
              {
                offset: 0.8,
                color: "#151307",
              },
            ],
            false
          ),
          shadowColor: "rgba(243,162,45, 0.1)",
          shadowBlur: 6,
        },
      },
      data: vdata,
    },
  ],
});

//消防检测echarts
const fireDetectionData = ref(null);
let fireDetectionEchart = null;
let firedata = ref([290, 460, 505, 750]);
const fireDetectionOption = reactive({
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
      data: ["其他", "手动报警", "烟感报警", "温感报警"],
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
      data: firedata,
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
//预警分析echarts
const warningAnalysisData = ref(null);
let warningAnalysisEcharts = null;
let datanan = ref([80, 80, 80, 70, 60, 50]);
let datanv = ref([40, 70, 50, 60, 30, 80]);
const warningAnalysisOption = reactive({
  // backgroundColor: "#111b29",
  color: ["#3D91F7", "#61BE67"],
  tooltip: {
    show: true, // 弹层数据去掉
  },
  legend: {
    show: false,
  },
  radar: {
    center: ["50%", "50%"], // 外圆的位置
    radius: "55%",
    name: {
      textStyle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 400,
        fontFamily: "PingFangSC-Regular,PingFang SC",
        fontStyle: "normal",
      },
    },
    // TODO:
    indicator: [
      {
        name: "综合评估",
        max: 100,
      },
      {
        name: "安防管理",
        max: 100,
      },
      {
        name: "能效管理",
        max: 100,
      },
      {
        name: "设备管理",
        max: 100,
      },
      {
        name: "通行管理",
        max: 100,
      },
    ],
    splitArea: {
      // 坐标轴在 grid 区域中的分隔区域，默认不显示。
      show: true,
      areaStyle: {
        // 分隔区域的样式设置。
        color: ["#1c2330"], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
      },
    },
    axisLine: {
      // 指向外圈文本的分隔线样式
      lineStyle: {
        color: "#167374",
      },
    },
    splitLine: {
      lineStyle: {
        type: "solid",
        color: "#167374", // 分隔线颜色
        width: 1, // 分隔线线宽
      },
    },
  },
  series: [
    {
      type: "radar",
      symbolSize: 5,
      itemStyle: {
        borderColor: "rgba(66, 242, 185, 1)",
        color: "#fff",
        borderWidth: 0.2,
      },
      lineStyle: {
        normal: {
          width: 1,
          color: "rgba(66, 242, 185, 1)",
        },
      },
      data: [
        {
          // TODO:
          value: datanan,
          name: "男",
          areaStyle: {
            normal: {
              color: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(46,203,255, 0.14)", // 0% 处的颜色
                  },
                  {
                    offset: 0.15,
                    color: "rgba(46,203,255, 0.14)", // 100% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: "rgba(46,203,255, 0.4)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(46,203,255, 0.5)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
        {
          // TODO:
          value: datanv,
          name: "女",
          itemStyle: {
            borderColor: "rgba(245, 196, 85, 1)",
            color: "#fff",
            borderWidth: 0.2,
          },
          lineStyle: {
            normal: {
              width: 1,
              color: "rgba(245, 196, 85, 1)",
            },
          },
          areaStyle: {
            normal: {
              color: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255, 127,0, 0.14)", // 0% 处的颜色
                  },
                  {
                    offset: 0.15,
                    color: "rgba(255, 127,0, 0.14)", // 100% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: "rgba(2255, 127,0, 0.4)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 127,0, 0.5)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
      ],
    },
  ],
});

const timer = setInterval(() => {
  vdata.value = vdata.value.map(() => 60 + Math.ceil(Math.random() * 50));
  firedata.value = firedata.value.map(
    () => 400 + Math.ceil(Math.random() * 600)
  );
  datanan.value = datanan.value.map(() => 50 + Math.ceil(Math.random() * 50));
  datanv.value = datanv.value.map(() => 50 + Math.ceil(Math.random() * 50));
  if (visitorEchart != null) {
    visitorEchart.setOption(visitorOption);
  }
  if (fireDetectionEchart != null) {
    fireDetectionEchart.setOption(fireDetectionOption);
  }
  if (warningAnalysisEcharts != null) {
    warningAnalysisEcharts.setOption(warningAnalysisOption);
  }
}, 2000);

onMounted(() => {
  visitorEchart = echarts.init(visitorData.value);
  visitorEchart.setOption(visitorOption);

  fireDetectionEchart = echarts.init(fireDetectionData.value);
  fireDetectionEchart.setOption(fireDetectionOption);

  warningAnalysisEcharts = echarts.init(warningAnalysisData.value);
  warningAnalysisEcharts.setOption(warningAnalysisOption);
  //echart自适应
  window.addEventListener("resize", () => {
    visitorEchart.resize();
    fireDetectionEchart.resize();
    warningAnalysisEcharts.resize();
  });
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
<template>
  <div class="left">
    <Container title="学校访客">
      <div class="visitorTitle">
        <div class="dayVisitor">
          <span>今日访客</span>
          <span>91人</span>
        </div>
        <div class="weekVisitor">
          <span>本周访客</span>
          <span>564人</span>
        </div>
      </div>
      <div class="visitorEcharts" ref="visitorData"></div>
    </Container>
    <Container title="消防检测">
      <div class="fireDetectionEcharts" ref="fireDetectionData"></div>
    </Container>
    <Container title="预警分析">
      <div class="warningAnalysisEcharts" ref="warningAnalysisData"></div>
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
  .visitorTitle {
    display: flex;
    margin-top: vh(20);
    .dayVisitor {
      width: vw(154);
      height: vh(38);
      background: url("/assets/2d/img/底@2x.png");
      background-size: 100% 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        text-align: center;
        flex: 1;
      }
    }
    .weekVisitor {
      width: vw(154);
      height: vh(38);
      background: url("/assets/2d/img/底@2x.png");
      background-size: 100% 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }
  .visitorEcharts {
    width: vw(380);
    height: vh(174);
    margin-bottom: vh(41);
  }

  .fireDetectionEcharts {
    width: vw(380);
    height: vh(230);
    margin-top: vh(30);
  }

  .warningAnalysisEcharts {
    width: vw(380);
    height: vh(330);
  }
}
</style>