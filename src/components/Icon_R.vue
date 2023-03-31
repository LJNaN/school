
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
    <el-button
      type="primary"
      class="tube"
      @click="tubeClick"
      :disabled="tubeDisabled"
      v-show="router.currentRoute.value.path === '/'"
    >{{ showTube ? '返回全貌' : '管线系统' }}</el-button>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import { API } from '@/ktJS/API.js'
import { useRouter } from "vue-router";
const router = useRouter();

let showTube = ref(false)
let tubeDisabled = ref(false)

function tubeClick() {
  showTube.value = !showTube.value
  API.tubes.showTube(showTube.value)
  tubeDisabled.value = true
  setTimeout(() => {
    tubeDisabled.value = false
  }, 1000)
}

const iconTitle = [
  { name: "门禁", url: "./assets/2d/img/icon/4.png" },
  { name: "监控", url: "./assets/2d/img/icon/5.png" },
  { name: "保卫处", url: "./assets/2d/img/icon/6.png" },
];
</script>



<style scoped lang ='scss'>
.iconTitle {
  pointer-events: all;
  width: vw(100);
  position: absolute;
  top: vh(100);
  right: vw(424);
  .tube {
    cursor: pointer;
    position: absolute;
    border: 1px solid #2f9bff;
    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #194c7d;
  }

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