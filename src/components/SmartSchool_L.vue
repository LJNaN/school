<script setup>
import {
  reactive,
  ref,
  toRefs,
  onBeforeMount,
  onMounted,
  watch,
  onUnmounted,
} from "vue";
import Container from "./Container.vue";
import * as echarts from "echarts";


//值班保卫信息数据
const securityData = [
  { id: "01", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "02", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "03", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "04", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "05", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "01", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "02", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "03", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "04", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "05", name: "李兆伟", telephone: "18987659990", location: "南门安保" },

];

let datanv = ref([40, 30, 80, 30, 50, 20, 40, 20, 10]);
let datanan = ref([80, 40, 40, 100, 35, 30, 30, 20, 20]);
const warningAnalysisData = ref(null);
let warningAnalysisOption = reactive({
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
        name: "名称2",
        max: 100,
      },
      {
        name: "名称1",
        max: 100,
      },
      {
        name: "名称9",
        max: 100,
      },
      {
        name: "名称8",
        max: 100,
      },
      {
        name: "名称7",
        max: 100,
      },
      {
        name: "名称6",
        max: 100,
      },
      {
        name: "名称5",
        max: 100,
      },
      {
        name: "名称4",
        max: 100,
      },
      {
        name: "名称3",
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
let warningAnalysisEcharts = null;
//echarts动态和自适应
let timer = setInterval(() => {
  datanv.value = datanv.value.map(() => 40 + Math.ceil(Math.random() * 50));
  datanan.value = datanv.value.map(() => 40 + Math.ceil(Math.random() * 50));
  if (warningAnalysisEcharts != null) {
    warningAnalysisEcharts.setOption(warningAnalysisOption);
  }
}, 2000);
function echartsResize() {
  warningAnalysisEcharts.resize();
}

onMounted(() => {
  warningAnalysisEcharts = echarts.init(warningAnalysisData.value);
  warningAnalysisEcharts.setOption(warningAnalysisOption);
  //echart自适应
  window.addEventListener("resize", echartsResize);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", echartsResize);
});
</script>
<template>
  <div class="left">
    <Container title="园区概况">
      <div class="parkProfile">
        <img src="/assets/2d/img/smartSchool/园区图片.png" />
        <P>
          学校历来重视党的建设和思想政治工作，坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻落实党的十九大和十九届历次全会精神，切实加强党对高校的全面领导，坚定不移落实全面从严治党主体责任，全面贯彻执行党的教育方针，落实立德树人根本任务，确保党的意志主张在高校落地生根，确保学校始终成为培养社会主义建设者和接班人的坚强阵地。
        </P>
      </div>
    </Container>
    <Container title="预警分析">
      <div class="warningAnalysis" ref="warningAnalysisData"></div>
    </Container>
    <Container title="值班保卫信息">
      <ul class="securityInformation">
        <li style="margin-top: 24px">
          <span class="id">序号</span>
          <span class="name">姓名</span>
          <span class="telephone">电话</span>
          <span class="location">位置</span>
        </li>
        <div class="Information-container">
          <div class="scroll-list">
            <li class="Information" v-for="(item, index) in securityData" :key="index" :style="{
              background: 'url(./assets/2d/img/smartSchool/1.png)',
              backgroundSize: '100% 100%',
            }">
              <span class="id">{{ item.id }}</span>
              <span class="name">{{ item.name }}</span>
              <span class="telephone">{{ item.telephone }}</span>
              <span class="location">{{ item.location }}</span>
            </li>
          </div>
        </div>

      </ul>
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

  .parkProfile {
    margin: vh(21) 0 vh(46) 0;

    img {
      width: vw(350);
      height: vh(100);
      margin: 0 auto;
    }

    p {
      margin-top: vh(16);
      font-size: rem(12);
      color: #b3b3b3;
    }
  }

  .warningAnalysis {
    height: vh(276);
    margin: vh(32) 0 0 0;
  }

  .securityInformation {

    height: vh(270);
    font-size: rem(12);
    margin-right: vw(14);

    li {
      height: vh(28);
      line-height: vh(28);
      text-align: center;
      display: flex;

      .id {
        flex: 1;
      }

      .name {
        flex: 2;
      }

      .telephone {
        flex: 3;
        text-align: start;
        padding-left: vw(27);
      }

      .location {
        flex: 3;
        text-align: end;
        padding-right: vw(12);
      }
    }

    .Information-container {
      position: relative;
      height: vh(190);
      overflow: hidden;

      .scroll-list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: vh(10);
        animation: scroll 6s linear infinite normal;

      }


      @keyframes scroll {
        100% {
          top: vh(-190)
        }
      }
    }


  }
}
</style>