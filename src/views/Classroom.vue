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
          <el-slider class="slider" v-model="equipmentControl.brightness" :show-tooltip="false" />
        </div>
        <div class="tempColtrol-row2-item">
          <p>温度</p>
          <el-slider class="slider" v-model="equipmentControl.temperature" :min="-10" :max="45" :show-tooltip="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const equipmentControl = ref({
  curtain: true,
  screen: true,
  brightness: 100,
  temperature: 26
})

onMounted(() => {

});
</script>


<style scoped lang="less">
.classroom {
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
