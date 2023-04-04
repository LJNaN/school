<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import Container from "./Container.vue";
import Video from "./Video.vue";

//实时监控数据
const monitorData = [
  {
    id: "01",
    name: "北门安保室",
    url: "./assets/2d/video/monitor1.mp4",
  },
  {
    id: "02",
    name: "南门安保室",
    url: "./assets/2d/video/monitor2.mp4",
  },
  {
    id: "03",
    name: "北门安保室",
    url: "./assets/2d/video/monitor3.mp4",
  },
  {
    id: "04",
    name: "图书馆2楼自习室",
    url: "./assets/2d/video/monitor4.mp4",
  },
];
//值班保卫信息数据
const securityData = [
  { id: "01", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "02", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "03", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "04", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
  { id: "05", name: "李兆伟", telephone: "18987659990", location: "南门安保" },
];
const parkData = {
  Security: [
    { name: "监管设备/个", value: "7830" },
    { name: "告警处置率/%", value: "84.6" },
    { name: "巡查检查/次", value: "165" },
    { name: "监控设备/个", value: "835" },
    { name: "设备完好度/%", value: "100" },
  ],
  trouble: [
    { name: "一般隐患", resolved: "320", unresolved: "741", total: "361" },
    { name: "重大隐患", resolved: "12", unresolved: "4", total: "16" },
  ],
};
</script>
<template>
  <div class="right">
    <Container title="园区安全态势">
      <div class="parkSecurity">
        <ul class="parkInformation">
          <li v-for="(item, index) in parkData.Security" :key="index">
            <span class="value">{{ item.value }}</span>
            <div></div>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
        <div class="troubleInformation">
          <div class="leftCircle">
            <div class="normalTrouble">
              <div class="circle"></div>
              <div class="text">
                <span>未解决</span>
                <span>已解决</span>
                <span>一般隐患</span>
              </div>
              <div class="lefttext">
                <span>{{ parkData.trouble[0].resolved }}次</span>
                <span>{{ parkData.trouble[0].unresolved }}次</span>
                <span>{{ parkData.trouble[0].total }}次</span>
              </div>
            </div>
            <div class="Information"></div>
          </div>
          <div class="rightCircle">
            <div class="abnormalTrouble">
              <div class="circle"></div>
              <div class="text">
                <span>未解决</span>
                <span>已解决</span>
                <span>重大隐患</span>
              </div>
              <div class="lefttext">
                <span>{{ parkData.trouble[1].resolved }}次</span>
                <span>{{ parkData.trouble[1].unresolved }}次</span>
                <span>{{ parkData.trouble[1].total }}次</span>
              </div>
            </div>
            <div class="Information"></div>
          </div>
        </div>
      </div>
    </Container>
    <Container title="实时监控">
      <ul class="monitor">
        <li v-for="(item, index) in monitorData" :key="index">
          <Video class="monitorVideo" :url="item.url"></Video>
          <div class="monitorName">
            <span>{{ item.id }}</span>
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </Container>
    <Container title="值班保卫信息">
      <ul class="securityInformation">
        <li style="margin-top: 24px">
          <span class="id">序号</span>
          <span class="name">姓名</span>
          <span class="telephone">电话</span>
          <span class="location">位置</span>
        </li>
        <li class="Information" v-for="(item, index) in securityData" :key="index" :style="{
          background: 'url(./assets/2d/img/smartSecurity/3.png)',
          backgroundSize: '100% 100%',
        }">
          <span class="id">{{ item.id }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="telephone">{{ item.telephone }}</span>
          <span class="location">{{ item.location }}</span>
        </li>
      </ul>
    </Container>
  </div>
</template>

<style scoped lang ='scss'>
.right {
  pointer-events: all;
  width: vw(380);
  height: vh(993);
  position: absolute;
  right: vw(10);
  top: vh(56);

  .parkSecurity {
    height: 250px;

    .parkInformation {
      margin: vh(29) 0 vh(20) 0;
      display: flex;
      justify-content: space-around;

      li {
        .value {
          font-size: rem(18);
        }

        div {
          width: 53px;
          height: 2px;
          background: linear-gradient(90deg,
              #3baaff 0%,
              rgba(59, 170, 255, 0) 100%);
        }

        .name {
          font-size: rem(12);
          scale: 0.83;
        }
      }

      :last-child {
        div {
          width: 53px;
          height: 2px;
          background: linear-gradient(90deg,
              #26ff63 0%,
              rgba(38, 255, 99, 0) 100%);
        }
      }
    }

    .troubleInformation {
      display: flex;

      .leftCircle {
        flex: 1;

        .normalTrouble {
          position: relative;
          width: vw(101);
          height: vh(101);
          background: rgba(59, 170, 255, 0.3);
          border: vw(1) solid #3baaff;
          border-radius: 50%;

          .circle {
            position: absolute;
            bottom: 0;
            left: vw(15);
            width: vw(71);
            height: vh(71);
            background: rgba(3, 229, 254, 0.3);
            border: vw(1) solid #03e5fe;
            border-radius: 50%;
          }

          .text {
            position: absolute;
            height: 160px;
            left: 30px;
            display: flex;
            flex-direction: column;
            font-size: rem(12);
            scale: 0.83;

            :nth-child(1) {
              flex: 1;
              color: #3baaff;
            }

            :nth-child(2) {
              flex: 1;
              color: #03e5fe;
            }

            :nth-child(3) {
              flex: 1;
              color: #a1a1a1;
            }
          }

          .lefttext {
            position: absolute;
            height: vh(114);
            width: vw(92);
            top: -vh(8);
            left: vw(74);
            line-height: vh(20);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            text-align: end;

            :nth-child(1) {
              flex: 1;
              color: #3baaff;
              border-bottom: 1px solid #ffffff;
            }

            :nth-child(2) {
              flex: 1;
              color: #03e5fe;
              vertical-align: bottom;
              border-bottom: 1px solid #ffffff;
            }

            :nth-child(3) {
              flex: 1;
              color: #a1a1a1;
              vertical-align: bottom;
              border-bottom: 1px solid #ffffff;
            }
          }
        }
      }

      .rightCircle {
        flex: 1;

        .abnormalTrouble {
          position: relative;
          width: vw(101);
          height: vh(101);
          background: rgba(255, 42, 0, 0.3);
          border: vw(1) solid #ff2a00;
          border-radius: 50%;

          .circle {
            position: absolute;
            bottom: 0;
            left: vw(15);
            width: vw(71);
            height: vh(71);
            background: rgba(255, 223, 0, 0.3);
            border: vw(1) solid #ffdf00;
            border-radius: 50%;
          }

          .text {
            position: absolute;
            height: 160px;
            left: 30px;
            display: flex;
            flex-direction: column;
            font-size: rem(12);
            scale: 0.83;

            :nth-child(1) {
              flex: 1;
              color: #ff2a00;
            }

            :nth-child(2) {
              flex: 1;
              color: #ffdf00;
            }

            :nth-child(3) {
              flex: 1;
              color: #a1a1a1;
            }
          }

          .lefttext {
            position: absolute;
            height: vh(114);
            width: vw(92);
            top: -vh(8);
            left: vw(74);
            line-height: vh(20);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            text-align: end;

            :nth-child(1) {
              flex: 1;
              color: #ff2a00;
              border-bottom: 1px solid #ffffff;
            }

            :nth-child(2) {
              flex: 1;
              color: #ffdf00;
              vertical-align: bottom;
              border-bottom: 1px solid #ffffff;
            }

            :nth-child(3) {
              flex: 1;
              color: #a1a1a1;
              vertical-align: bottom;
              border-bottom: 1px solid #ffffff;
            }
          }
        }
      }
    }
  }

  .monitor {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: vh(25) 0 vh(67) vw(5);
    gap: vw(9);

    li {
      width: vw(170);
      height: vh(118);
      border: 1px solid #2190ca;
      border-radius: 5px;
      overflow: hidden;

      .monitorVideo {
        width: 100%;
        height: vh(90);
      }

      .monitorName {
        display: flex;
        width: 100%;
        height: vh(23);

        justify-content: center;
        align-items: center;
        background: url("/assets/2d/img/smartSchool/4.png");
        background-size: 100% 100%;

        :first-child {
          width: 10%;
          margin-left: vw(5);
          font-size: rem(12);
          scale: 0.8;
        }

        :last-child {
          width: 90%;
          text-align: center;
          font-size: rem(12);
          scale: 0.8;
        }
      }
    }
  }

  .securityInformation {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
  }
}
</style>