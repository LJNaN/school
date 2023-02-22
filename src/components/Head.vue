<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
</script>
<template>
  <div class="head"><span>可视化智慧校园</span></div>
</template>

<style scoped lang ='scss'>
.head {
  position: fixed;
  width: 100vw;
  height: vh(86);
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/assets/2d/img/head@2x.png");
  background-size: 100% 100%;
  span{
    margin:auto;
    width: vw(424);
    height: vh(37);
    text-align: center;
    word-spacing: 200px;
    font-size: rem(50);
    font-family: 'YouSheBiaoTiHei';
    font-weight: 400;
    color: #FFFFFF;
    line-height: vh(18);
    opacity: 0.8;
  }
}
</style>
