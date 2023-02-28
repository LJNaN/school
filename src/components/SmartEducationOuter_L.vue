<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import Container from "./Container.vue";
//教学情况查看数据
const teachSituationData = [
  {
    name: "上课教师人数",
    value: "282",
    imgUrl: "/assets/2d/img/教学情况查看1.png",
  },
  {
    name: "上课学生人数",
    value: "290",
    imgUrl: "/assets/2d/img/教学情况查看1.png",
  },
  {
    name: "涉及课程门类",
    value: "302",
    imgUrl: "/assets/2d/img/教学情况查看2.png",
  },
  {
    name: "授课学院数量",
    value: "322",
    imgUrl: "/assets/2d/img/教学情况查看3.png",
  },
];
//停车场占用率数据

//会议室使用情况数据
const roomUsageData = [];
for (let i = 0; i < 32; i++) {
  roomUsageData.push({
    name: "1F",
    imgUrl: `/assets/2d/img/room${Math.ceil(Math.random() * 3)}.png`,
  });
}
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
      <div class="parkingUsage"></div>
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
    height: 200px;
    margin: vh(33) 0 vh(80) 0;
    border: 1px solid red;
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
