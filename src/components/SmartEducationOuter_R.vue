<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import Container from "./Container.vue";
//教学资源使用率数据
const resourceUseageData = [
  {
    name: "音频文件",
    today: "1.235",
    total: "1.235",
    url: "/assets/2d/img/smartEducationOuter/音频文件2@2x.png",
  },
  {
    name: "文档文件",
    today: "1.235",
    total: "1.235",
    url: "/assets/2d/img/smartEducationOuter/文档文件2@2x.png",
  },
  {
    name: "教学活动",
    today: "1.235",
    total: "1.235",
    url: "/assets/2d/img/smartEducationOuter/教学活动2@2x.png",
  },
];
//7日学习记录数据
const learningRecordData = [
  { name: "总开课率", value: "54.4%" },
  { name: "资源总数（个）", value: "1.235" },
  { name: "开课教师数（个）", value: "2.234" },
];
const learningRecordData2 = [
  { head: "春季学期总课程数", left: "31", right: "10", L: "216.2", R: "110.2" },
  { head: "开课总数", left: "23", right: "18", L: "160.2", R: "166.2" },
  { head: "访问学生总数", left: "64", right: "7", L: "256.2", R: "70.2" },
];
</script>
<template>
  <div class="right">
    <Container title="教学楼教师使用情况">
      <div class="tltleValue">
        <span class="blue">96.83%</span>
        <span class="yellow">3.17%</span>
      </div>
      <div class="teacherUsage">
        <img src="/assets/2d/img/smartEducationOuter/组17@2x.png" />
        <ul class="eventProportion">
          <li>
            <span class="text1">事件占比</span><span class="value">56.8%</span>
          </li>
          <li>
            <span class="text2">事件占比</span><span class="value">56.8%</span>
          </li>
        </ul>
      </div>
    </Container>
    <Container title="教学资源使用率">
      <ul class="resourceUseage">
        <li
          class="resourceUseageItem"
          v-for="(item, index) in resourceUseageData"
          :key="index"
        >
          <img :src="item.url" class="icon" />
          <div class="rUContent">
            <div class="rUItem">
              <p class="key">
                <span class="blue">|</span>
                <span>当天使用次数</span>
              </p>
              <p class="val blue">1.235</p>
            </div>
            <div class="rUItem">
              <p class="key">
                <span class="yellow">|</span>
                <span>当天使用次数</span>
              </p>
              <p class="val yellow">1.235</p>
            </div>
          </div>
        </li>
      </ul>
    </Container>
    <Container title="7日学习记录">
      <div class="learningRecord">
        <ul class="title">
          <li v-for="(item, index) in learningRecordData" :key="index">
            <P class="value">{{ item.value }}</P>
            <P>{{ item.name }}</P>
          </li>
        </ul>
        <ul class="totalData">
          <li v-for="(item, index) in learningRecordData2" :key="index">
            <p><span class="bar"></span>{{ item.head }}</p>
            <div class="totalValue">
              <div class="totalLeft" :style="{ width: item.L + 'px' }">
                本科<span>{{ item.left }}</span>
              </div>
              <div class="totalRight" :style="{ width: item.R + 'px' }">
                研究生<span>{{ item.right }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Container>
  </div>
</template>

<style 
scoped lang ='scss'>
.right {
  pointer-events: all;
  width: vw(380);
  height: vh(993);
  position: absolute;
  top: vh(56);
  right: vw(10);
  .tltleValue {
    font-size: rem(14);
    position: relative;
    left: vw(28);
    top: vh(38);
    .blue {
      color: #6fecffbf;
      margin-right: vw(65);
    }
    .yellow {
      color: #ffe96fbf;
    }
  }
  .teacherUsage {
    margin: vh(44) 0 vh(62) 0;
    display: flex;

    img {
      margin-left: vw(37);
      width: vw(129);
      height: vh(107);
    }
    .eventProportion {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      li {
        width: vw(160);
        height: vh(22);
        margin-left: vw(34);
        font-size: rem(12);
        background: rgba(109, 132, 141, 0.1);
        border: 1px solid rgba(143, 178, 195, 0.35);
        box-shadow: 6px 13px 10px 0px rgba(13, 21, 29, 0.3);
        border-radius: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .text1::before {
          content: "";
          display: inline-block;
          margin: vh(5) vw(10) vh(5) 0;
          width: vw(5);
          height: vh(5);
          background: #1786ff;
          border-radius: 50%;
        }
        .text2::before {
          content: "";
          display: inline-block;
          margin: vh(5) vw(10) vh(5) 0;
          width: vw(5);
          height: vh(5);
          background: #ffe849;
          border-radius: 50%;
        }
      }
    }
  }
  .resourceUseage {
    margin: vh(40) 0 vh(58) 0;
    .resourceUseageItem {
      display: flex;
      justify-content: space-between;
      .icon {
        width: 72px;
        height: 72px;
      }
      .rUContent {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .rUItem {
          .blue {
            font-size: rem(18);
            color: #17b0ffff;
            margin-right: vw(10);
          }
          .yellow {
            font-size: rem(18);
            color: #ffe849ff;
            margin-right: vw(10);
          }
        }
      }
    }
  }
  .learningRecord {
    .title {
      display: flex;
      justify-content: space-around;
      align-items: center;
      li {
        width: vw(110);
        height: vh(65);
        font-size: rem(12);
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        gap: vh(7);
        background: url("/assets/2d/img/smartEducationOuter/组1649@2x.png");
        background-size: 100% 100%;
        .value {
          width: 100%;
          font-size: rem(20);
          color: #26c1fdff;
        }
      }
    }
    .totalData {
      padding: vw(25);
      display: flex;
      flex-wrap: wrap;
      font-size: rem(12);
      gap: vh(24);
      li {
        width: 100%;
        p {
          display: flex;
          line-height: vh(12);
          margin-bottom: vh(8);
        }
        .bar {
          width: vw(6);
          height: vh(13);
          background: #17b0ff;
          opacity: 0.3;
          margin-right: vw(5);
        }
        p::before {
          content: "";
          display: inline-block;
          width: vw(4);
          height: vh(6);
          margin-right: vw(10);
          background: url("/assets/2d/img/smartEducationOuter/多边形 5@2x.png");
          background-size: 100% 100%;
        }
        p::after {
          content: "";
          display: inline-block;
          width: vw(6);
          height: vh(18);
          margin-left: vw(10);
          background: url("/assets/2d/img/smartEducationOuter/组 1649@2x(1).png");
          background-size: 100% 100%;
        }

        .totalValue {
          display: flex;
          .totalLeft {
            height: vh(24);
            background: rgba(23, 176, 255, 0.1);
            border: 1px solid rgba(23, 176, 255, 0.4);
            display: flex;
            justify-content: start;
            align-items: center;
            padding-left: vw(11);
          }
          .totalRight {
            height: vh(24);
            background: rgba(211, 237, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.4);
            display: flex;
            justify-content: end;
            align-items: center;
            padding-right: vw(11);
          }
        }
      }
    }
  }
}
</style>
