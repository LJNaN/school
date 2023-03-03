<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted, watch } from "vue";
import { useRoute } from 'vue-router'
import Container from "./Container.vue";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'

const route = useRoute()
const classRoomName = route.query?.id || ''


//设备运行状况数据
const equipmentSituationData = [
  { name: "照明", total: "35", open: "35", close: "35", offline: "13" },
  { name: "摄像头", total: "42", open: "24", close: "16", offline: "28" },
  { name: "门禁", total: "35", open: "15", close: "22", offline: "35" },
  { name: "新风设备", total: "35", open: "13", close: "26", offline: "35" },
];
//设备调节
const equipmentControl = ref({
  curtain: true,
  screen: true,
  brightness: 100,
  temperature: 26
})

if (classRoomName) {
  API.classRoom.currentClassRoomName = classRoomName
  if(API.classRoom.info.name != classRoomName) {
    API.classRoom.info = STATE.classRoomInfo.find(e => e.name === classRoomName)
  }
  
  watch(() => JSON.parse(JSON.stringify(equipmentControl.value)), (newData, oldData) => {
    if (oldData) {
      if (newData.curtain != oldData.curtain) API.classRoom.curtain(newData.curtain)
      if (newData.screen != oldData.screen) API.classRoom.screen(newData.screen)
      if (newData.brightness != oldData.brightness) API.classRoom.brightness(newData.brightness)
      if (newData.temperature != oldData.temperature) API.classRoom.temperature(newData.temperature)
    } else {
      // API.classRoom.curtain(newData.curtain)
      API.classRoom.screen(newData.screen)
      API.classRoom.brightness(newData.brightness)
      API.classRoom.temperature(newData.temperature)
    }
  }, {
    immediate: true,
    deep: true
  })
}


//监控数据
const monitorData = [
  {
    id: "01",
    name: "北门安保室",
    url: "./assets/2d/img/smartEducationInner/监控视频@2x.png",
  },
  {
    id: "02",
    name: "南门安保室",
    url: "./assets/2d/img/smartEducationInner/监控视频@2x.png",
  },
  {
    id: "03",
    name: "北门安保室",
    url: "./assets/2d/img/smartEducationInner/监控视频@2x.png",
  },
  {
    id: "04",
    name: "图书馆2楼自习室",
    url: "./assets/2d/img/smartEducationInner/监控视频@2x.png",
  },
];
</script>
<template>
  <div class="right">
    <Container title="智能设备运行情况">
      <ul class="equipmentSituation">
        <li>
          <span>设备名称</span>
          <span>总数</span>
          <span>开启</span>
          <span>关闭</span>
          <span>离线</span>
        </li>
        <li v-for="(item, index) in equipmentSituationData" :key="index">
          <span>{{ item.name }}</span>
          <span class="blue">{{ item.total }}</span>
          <span class="green">{{ item.open }}</span>
          <span class="orange">{{ item.close }}</span>
          <span class="gray">{{ item.offline }}</span>
        </li>
      </ul>
    </Container>

    <container title="设备调节">
      <div class="equipmentAdjustment">
        <div class="button">
          <div><span>窗帘</span> <el-switch v-model="equipmentControl.curtain"></el-switch></div>
          <div><span>屏幕</span> <el-switch v-model="equipmentControl.screen"></el-switch></div>
        </div>
        <div class="slider">
          <div style="display: flex">
            <img
              src="/assets/2d/img/smartEducationInner/亮度@2x.png"
              class="icon"
            />
            <div>
              <p>亮度</p>
              <el-slider v-model="equipmentControl.brightness" :min="5" :max="100" :show-tooltip="false"></el-slider>
            </div>
          </div>
          <div style="display: flex">
            <img
              src="/assets/2d/img/smartEducationInner/温度@2x.png"
              class="icon"
            />
            <div>
              <p>温度</p>
              <el-slider v-model="equipmentControl.temperature" :min="-10" :max="45" :show-tooltip="false"></el-slider>
            </div>
          </div>
        </div>
      </div>
    </container>

    <Container title="实时监控">
      <ul class="monitor">
        <li v-for="(item, index) in monitorData" :key="index">
          <div
            class="monitorVideo"
            :style="{
              background: `url(${item.url})`,
              backgroundSize: '100% 100%',
            }"
          ></div>
          <div class="monitorName">
            <span>{{ item.id }}</span>
            <span>{{ item.name }}</span>
          </div>
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
  top: vh(56);
  right: vw(10);
  .equipmentSituation {
    margin: vh(28) 0 vh(58) vw(23);
    li {
      display: flex;
      width: vw(335);
      height: vh(34.4);
      margin-bottom: 10px;
      // justify-content: space-around;
      justify-content: space-between;
      align-items: center;
      span {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .blue::before {
        content: "";
        display: inline-block;
        width: vw(20);
        height: vh(20);
        background: url("/assets/2d/img/smartEducationInner/blueDot@2x.png");
        background-size: 100% 100%;
      }
      .green::before {
        content: "";
        display: inline-block;
        width: vw(20);
        height: vh(20);
        background: url("/assets/2d/img/smartEducationInner/greenDot@2x.png");
        background-size: 100% 100%;
      }
      .orange::before {
        content: "";
        display: inline-block;
        width: vw(20);
        height: vh(20);
        background: url("/assets/2d/img/smartEducationInner/orangeDot@2x.png");
        background-size: 100% 100%;
      }
      .gray::before {
        content: "";
        display: inline-block;
        width: vw(20);
        height: vh(20);
        background: url("/assets/2d/img/smartEducationInner/orangeDot@2x.png");
        background-size: 100% 100%;
      }
      &:nth-child(n + 2) {
        background: url("/assets/2d/img/smartEducationInner/圆角矩形@2x.png");
        background-size: 100% 100%;
      }
    }
  }
  .equipmentAdjustment {
    .button {
      display: flex;
      margin-top: vh(34);
      justify-content: center;
      gap: vw(27);
      :deep(.el-switch__core) {
        min-width: vw(34);
        height: vh(16);
      }
    }
    .slider {
      margin-top: vh(35);
      .icon {
        width: vw(84);
        height: vh(74);
        margin-right: vw(12);
      }
      :deep(.el-slider) {
        width: vw(200);
        // --el-slider-button-wrapper-size: 43px;
      }
      :deep(.el-slider__runway) {
        // height: vh(14);
      }
    }
  }

  .monitor {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: vh(25) 0 vh(97) vw(5);
    gap: vw(9);
    li {
      width: vw(170);
      height: vh(118);
      border: 1px solid #2190ca;
      border-radius: 5px;
      overflow: hidden;
      .monitorVideo {
        width: 100%;
        height: vh(97);
      }
      .monitorName {
        display: flex;
        width: 100%;
        height: vh(23);
        justify-content: center;
        align-items: center;
        background: url("/assets/2d/img/smartEducationInner/监控底部@2x.png");
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
}
</style>
