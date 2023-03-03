<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import Container from "./Container.vue";
const resourceUseageData = [
  {
    name: "音频文件",
    today: "1.235",
    total: "1.235",
    url: "/assets/2d/img/smartEducationInner/音频文件@2x.png",
  },
  {
    name: "文档文件",
    today: "1.235",
    total: "1.235",
    url: "/assets/2d/img/smartEducationInner/文档文件@2x.png",
  },
  {
    name: "教学活动",
    today: "1.235",
    total: "1.235",
    url: "/assets/2d/img/smartEducationInner/教学活动@2x.png",
  },
];

const classSituationData = [
  {
    L: { name: "今日应上课数", value: "31", unit: "节" },
    R: { name: "今日应上课学生数", value: "547", unit: "人" },
  },
  {
    L: { name: "今日访问量", value: "331", unit: "人次" },
    R: { name: "今日访问时长", value: "3.1", unit: "小时" },
  },
  {
    L: { name: "今日发起互动数", value: "415", unit: "次" },
    R: { name: "今日参与互动人数", value: "245", unit: "人" },
  },
];
</script>
<template>
  <div class="left">
    <Container title="智慧教室使用情况">
      <ul class="classroomUsage">
        <li>
          <div class="picture1"><span>89</span></div>
          <span>房间总数</span>
        </li>
        <li>
          <div class="picture2"><span>32</span></div>
          <span>使用中</span>
        </li>
        <li>
          <div class="picture3"><span>19</span></div>
          <span>空闲</span>
        </li>
      </ul>
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
    <Container title="今日实时上课情况">
      <div class="classSituation">
        <div class="title">
          <div class="leftBox">
            <div class="bar"></div>
            <div class="box">
              <div class="num">5421</div>
              <span>今日活跃学生数</span>
            </div>
          </div>
          <div class="rightBox">
            <div class="bar"></div>
            <div class="box">
              <div class="num">547</div>
              <span>今日活跃教师数</span>
            </div>
          </div>
        </div>
        <ul>
          <li v-for="(item, index) in classSituationData" :key="index">
            <div class="leftLi">
              <p class="leftP">{{ item.L.name }}</p>
              <div
                style="
                  background: url('/assets/2d/img/smartEducationInner/矩形拷贝L@2x.png')
                    center/cover;
                "
              >
                <span style="color: #17b0ff">{{ item.L.value }}</span>
                <span>{{ item.L.unit }}</span>
              </div>
            </div>
            <div class="rightLi">
              <p class="rightP">{{ item.R.name }}</p>
              <div
                style="
                  background: url('/assets/2d/img/smartEducationInner/矩形拷贝R@2x.png');
                  background-size: '100% 100%';
                "
              >
                <span>{{ item.R.value }}</span>
                <span>{{ item.R.unit }}</span>
              </div>
            </div>
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
  .classroomUsage {
    display: flex;
    justify-content: space-around;
    margin-top: vh(40);
    li {
      > span {
        display: block;
        width: 100%;
        color: #e7faffff;
        font-size: rem(14);
        opacity: 0.6;
        text-align: center;
        margin: vh(20) 0 vh(40) 0;
      }
      div {
        width: vw(88);
        height: vh(88);
        display: flex;
        span {
          color: #fff;
          font-size: rem(30);
          margin: auto;
        }
      }
      .picture1 {
        background: url("/assets/2d/img/smartEducationInner/classroom1@2x.png");
        background-size: 100% 100%;
      }
      .picture2 {
        background: url("/assets/2d/img/smartEducationInner/classroom2@2x.png");
        background-size: 100% 100%;
      }
      .picture3 {
        background: url("/assets/2d/img/smartEducationInner/classroom3@2x.png");
        background-size: 100% 100%;
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
  .classSituation {
    margin-top: vh(34);
    .title {
      display: flex;
      justify-content: center;
      gap: vw(3);
      .leftBox {
        width: vw(165);
        .bar {
          height: 2px;
          background: #b4e5ff;
        }
        .box {
          height: 61px;
          text-align: center;
          color: #a7a7a7;
          background: linear-gradient(
            0deg,
            rgba(180, 229, 255, 0) 0%,
            rgba(180, 229, 255, 0.15) 100%
          );
          .num {
            font-size: rem(20);
            line-height: vh(36);
            color: #17b0ff;
          }
        }
      }
      .rightBox {
        width: vw(165);
        .bar {
          height: 2px;
          background: #b4e5ff;
        }
        .box {
          height: 61px;
          text-align: center;
          color: #a7a7a7;
          background: linear-gradient(
            0deg,
            rgba(180, 229, 255, 0) 0%,
            rgba(180, 229, 255, 0.15) 100%
          );
          .num {
            font-size: rem(20);
            line-height: vh(36);
            color: #17b0ff;
          }
        }
      }
    }
    ul {
      padding: vw(20);
      font-size: rem(12);
      li {
        display: flex;
        justify-content: space-between;
        gap: vw(20);
        p {
          color: #e5f5f6;
          opacity: 0.8;
        }
        .leftLi {
          flex: 1;
          .leftP {
            &.leftP::before {
              content: "";
              display: inline-block;
              width: vw(6);
              height: vh(13);
              margin-right: vw(6);
              background: #17b0ff;
              opacity: 0.3;
            }
          }
          div {
            width: vw(158);
            height: vh(32);
          }
          span {
            display: inline-block;
            line-height: vh(32);
            &:first-child {
              margin-left: vw(12);
            }
          }
        }
        .rightLi {
          flex: 1;
          text-align: right;
          .rightP {
            &.rightP::after {
              content: "";
              display: inline-block;
              width: vw(6);
              height: vh(13);
              margin-left: vw(6);
              background: #d3edff;
              opacity: 0.3;
            }
          }
          div {
            width: vw(158);
            height: vh(32);
          }
          span {
            display: inline-block;
            line-height: vh(32);
            &:last-child {
              margin-right: vw(12);
            }
          }
        }
      }
    }
  }
}
</style>
