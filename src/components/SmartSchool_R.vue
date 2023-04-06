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
//监控报警数据
const monitorAlertData = [
  { id: 1, name: "文科教学楼2202", event: "摄像头灭火报警" },
  { id: 2, name: "文科教学楼2201", event: "摄像头灭火报警" },
  { id: 3, name: "文科教学楼2302", event: "摄像头灭火报警" },
  { id: 4, name: "文科教学楼2401", event: "摄像头灭火报警" },
  { id: 5, name: "文科教学楼2101", event: "摄像头灭火报警" },
  { id: 1, name: "文科教学楼2202", event: "摄像头灭火报警" },
  { id: 2, name: "文科教学楼2201", event: "摄像头灭火报警" },
  { id: 3, name: "文科教学楼2302", event: "摄像头灭火报警" },
  { id: 4, name: "文科教学楼2401", event: "摄像头灭火报警" },
  { id: 5, name: "文科教学楼2101", event: "摄像头灭火报警" },
];
</script>
<template>
  <div class="right">
    <Container title="教学楼使用情况">
      <div class="buildUsage">
        <img src="/assets/2d/img/smartSchool/3.png" />
        <div class="leftText">
          <p><span>宿舍使用</span><span>195个（64.1%）</span></p>
          <p><span>教师使用</span><span>105个（35.9%）</span></p>
          <p><span>总数</span><span>105个（100%）</span></p>
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
    <Container title="监控警报">
      <div class="monitorAlert">
        <div class="title">
          <img src="/assets/2d/img/smartSchool/5.png" />
          <div class="eventTotal">
            <p class="num">26</p>
            <p>事件总数（件）</p>
          </div>
          <div class="deviceBtn">
            <div class="Btn">消防</div>
            <div class="Btn">门禁</div>
            <div class="chooseBtn">摄像头</div>
          </div>
        </div>
        <ul>
          <div class="Information-container">
            <div class="scroll-list">
              <li v-for="(item, index) in monitorAlertData" :key="index">
                <div class="index">{{ item.id }}</div>
                <span>{{ item.name }}</span>
                <span class="event">{{ item.event }}</span>
                <button class="Btn"><span>查看</span></button>
              </li>
            </div>
          </div>
        </ul>
      </div>
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

  .buildUsage {
    margin: vh(25) 0 vh(51) 0;
    display: flex;
    justify-content: space-around;

    img {
      width: vw(159);
      height: vh(159);
    }

    .leftText {
      width: vw(242);
      height: vh(159);
      font-size: rem(13);
      display: flex;
      flex-wrap: wrap;
      gap: vh(10);
      padding: vh(25) vw(11) 0 0;

      p {
        width: 100%;
        display: flex;
        justify-content: space-between;

        :first-child {
          text-align: end;
        }

        span {
          width: 46%;
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

  .monitorAlert {
    padding-left: vw(14);
    padding-right: vw(14);

    .title {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: vw(92);
        height: vh(100);
      }

      .eventTotal {
        flex: 1;

        p {
          font-size: rem(12);
        }

        .num {
          font-size: rem(26);
          font-family: YouSheBiaoTiHei;
        }
      }

      .deviceBtn {
        display: flex;
        align-items: center;
        flex: 2;

        div {
          flex: 1;
          width: vw(49);
          height: vh(19);
          line-height: vh(19);
          font-size: rem(12);
          text-align: center;
        }

        .Btn {
          background: url("/assets/2d/img/smartSchool/6.png");
          background-size: 100% 100%;
        }

        .chooseBtn {
          background: url("/assets/2d/img/smartSchool/7.png");

          background-size: 100% 100%;
        }
      }
    }

    ul {
      font-size: rem(12.78);

      li {
        width: vw(342);
        height: vh(32);
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: url("/assets/2d/img/smartSchool/8.png");

        .index {
          width: vw(12);
          height: vh(15);
          line-height: vh(15);
          background: gray;
          border-radius: 2px;
          text-align: center;
        }

        .event {
          color: #ffe849;
        }

        .Btn {
          width: 34px;
          height: 19px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          background: rgba(135, 142, 147, 0.7);
          border-radius: 5px;
        }
      }



      .Information-container {
        position: relative;
        height: vh(210);
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
            top: vh(-210)
          }
        }
      }


      :nth-child(3),
      :nth-child(8) {
        .index {
          color: #1fadff;
        }
      }
    }
  }
}
</style>