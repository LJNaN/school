<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
const iconTitle = [
  {
    name: "温度",
    value: "8.3",
    unit: "℃",
    color: "#fb8229",
    url: "./assets/2d/img/icon/icon_L温度.png",
  },
  {
    name: "湿度",
    value: "72%",
    unit: "%RH",
    color: "#2a94ff",
    url: "./assets/2d/img/icon/icon_L湿度.png",
  },
  {
    name: "空气质量",
    value: "790",
    unit: "m",
    color: "#52c673",
    url: "./assets/2d/img/icon/icon_L空气质量.png",
  },
  {
    name: "PM2.5",
    value: "56",
    unit: "g/m³",
    color: "#41f9f2",
    url: "./assets/2d/img/icon/icon_LPM2.5.png",
  },
];
</script>
<template>
  <div class="iconTitle">
    <ul>
      <li v-for="(icon, index) in iconTitle" :key="index">
        <div
          class="icon"
          :style="{
            background: `url(${icon.url})`,
            backgroundSize: '100% 100%',
          }"
        ></div>
        <span>{{ icon.name }}</span>
        <span class="value" :style="{ color: `${icon.color}` }">{{
          icon.value
        }}</span>
        <span>{{ icon.unit }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang ='scss'>
.iconTitle {
  pointer-events: all;
  position: absolute;
  top: vh(97);
  left: vw(417);
  ul {
    width: vw(285);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    li {
      width: 50%;
      height: vh(30);
      display: flex;
      justify-content: start;
      align-items: center;
      .icon {
        width: 30px;
        height: 30px;
        padding-right: vw(3);
      }
      span {
        font-size: rem(12);
        text-align: center;
        padding-right: vw(6);
      }
      .value {
        font-size: rem(16);
        font-family: "YouSheBiaoTiHei";
      }
    }
  }
}
</style>