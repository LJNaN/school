<script setup>
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
import router from "@/router";
const curUrl = router.currentRoute.value.fullPath.substring(1)
let Urlindex = ref(1)
const urlArray = ['SmartSchool', 'SmartEducationOuter', 'SmartSecurity', 'SmartEnergy']
Urlindex = urlArray.indexOf(curUrl) + 1


</script>
<template>
  <div class="foot">
    <router-link to="/SmartSchool">
      <div class="school" :class="{ 'select-1': Urlindex === 1 }"></div>
      <span>智慧校园</span>
    </router-link>

    <router-link to="SmartEducationOuter">
      <div class="education" :class="{ 'select-2': Urlindex === 2 }"></div>
      <span>智慧教学</span>
    </router-link>

    <router-link to="SmartSecurity">
      <div class="security" :class="{ 'select-3': Urlindex === 3 }"></div>
      <span>智慧安防</span>
    </router-link>
    <router-link to="SmartEnergy">
      <div class="energy" :class="{ 'select-4': Urlindex === 4 }"></div>
      <span>智慧能源</span>
    </router-link>
  </div>
</template>

<style scoped lang ='scss'>
.foot {
  pointer-events: all;
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
    background: url("/assets/2d/img/foot/1.png");
    background-size: 100% 100%;
  }

  .select-1 {
    background: url("/assets/2d/img/foot/s1.png");
    background-size: 100% 100%;
  }

  .education {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/2.png");
    background-size: 100% 100%;
  }

  .select-2 {
    background: url("/assets/2d/img/foot/s2.png");
    background-size: 100% 100%;
  }

  .security {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/3.png");
    background-size: 100% 100%;
  }

  .select-3 {
    background: url("/assets/2d/img/foot/s3.png");
    background-size: 100% 100%;
  }



  .energy {
    width: vw(70);
    height: vh(70);
    background: url("/assets/2d/img/foot/4.png");
    background-size: 100% 100%;
  }

  .select-4 {
    background: url("/assets/2d/img/foot/s4.png");
    background-size: 100% 100%;
  }


  span {
    font-size: rem(14);
    text-align: center;
    margin-left: vw(6);
  }
}
</style>
