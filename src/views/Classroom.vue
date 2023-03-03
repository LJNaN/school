<template>
  <div class="classroom">
    <div class="tempControl">
      <p>设备调节</p>
      <div class="tempControl-row1">
        <div class="tempControl-row1-item">
          <p>窗帘</p>
          <el-switch class="switch" v-model="equipmentControl.curtain" />
        </div>
        <div class="tempControl-row1-item">
          <p>屏幕</p>
          <el-switch class="switch" v-model="equipmentControl.screen" />
        </div>
      </div>
      <div class="tempControl-row2">
        <div class="tempColtrol-row2-item">
          <p>亮度</p>
          <el-slider class="slider" v-model="equipmentControl.brightness" :min="5" :max="100" :show-tooltip="false" />
        </div>
        <div class="tempColtrol-row2-item">
          <p>温度</p>
          <el-slider class="slider" v-model="equipmentControl.temperature" :min="-10" :max="45" :show-tooltip="false" />
        </div>
      </div>
    </div>
</div>
</template>

<script setup>

import { onMounted, ref, watch, computed, reactive } from "vue";
import { useRoute } from 'vue-router'
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'


const route = useRoute()
const classRoomName = route.query?.id || ''

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


onMounted(() => {

});
</script>


<style scoped lang="less">
.classroom {
  pointer-events: none;
  position: fixed;
  height: 100vh;
  width: 100vw;

  .tempControl {
    text-align: center;
    position: absolute;
    right: 0;
    margin-top: 30vh;
    height: 30vh;
    width: 20vw;
    display: flex;
    border: 1px solid red;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;

    &-row1 {
      display: flex;
      width: 50%;
      justify-content: space-between;

      &-item {
        display: flex;
        align-items: center;

        .switch {
          pointer-events: all;
        }
      }
    }

    &-row2 {
      width: 80%;

      .slider {
        pointer-events: all;
      }
    }
  }
}
</style>
