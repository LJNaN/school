<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
const iconTitle = [
  { name: "水", url: "./assets/2d/img/icon/水@2x.png" },
  { name: "电", url: "./assets/2d/img/icon/电@2x.png" },
  { name: "气", url: "./assets/2d/img/icon/气@2x.png" },
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
      </li>
    </ul>
  </div>
</template>

<style scoped lang ='scss'>
.iconTitle {
  width: vw(100);
  position: absolute;
  top: vh(100);
  right: vw(424);
  li {
    height: vh(30);
    display: flex;
    margin-bottom: vh(10);
    .icon {
      width: vw(30);
      height: vh(30);
    }
    span {
      display: flex;
      align-items: center;
      margin-left: vw(16);
      font-size: rem(18);
    }
  }
}
</style>