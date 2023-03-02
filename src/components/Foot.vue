<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
</script>
<template>
  <div class="foot">
    <router-link to="/SmartSchool">
      <div class="school"></div>
      <span>智慧校园</span></router-link
    >

    <router-link to="SmartEducationOuter">
      <div class="education"></div>
      <span>智慧教学</span>
    </router-link>

    <router-link to="SmartSecurity">
      <div class="security"></div>
      <span>智慧安防</span>
    </router-link>
    <router-link to="SmartEnergy">
      <div class="energy"></div>
      <span>智慧能源</span>
    </router-link>
  </div>
</template>

<style scoped lang ='scss'>
.foot {
  position: absolute;
  left: vw(754);
  bottom: vh(81);
  display: flex;
  gap: vw(14);
  div {
    flex: 1;
    width: vw(70);
    height: vh(92);
  }
  // :nth-child(n+2){
  //     // margin-left: vw(14);
  // }
  .school {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/校园@2x.png");
    background-size: 100% 100%;
  }
  .education {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/教学@2x.png");
    background-size: 100% 100%;
  }
  .security {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/安防@2x.png");
    background-size: 100% 100%;
  }
  .energy {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/能源@2x.png");
    background-size: 100% 100%;
  }
  span {
    font-size: rem(14);
    text-align: center;
    margin-left: vw(6);
  }
}
</style>
