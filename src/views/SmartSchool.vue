<script setup >
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import Head from "@/components/Head.vue";
import Foot from "@/components/Foot.vue";
import Icon_R from "@/components/Icon_R.vue";
import Icon_L from "@/components/Icon_L.vue";
import Icon_R_Energy from "@/components/Icon_R_Energy.vue";

import SmartSchool_L from "@/components/SmartSchool_L.vue";
import SmartSchool_R from "@/components/SmartSchool_R.vue";

const leftRef = ref(null);
</script>


<template>
  <div class="home">
    <Head></Head>
    <Foot></Foot>
    <SmartSchool_L></SmartSchool_L>
    <SmartSchool_R></SmartSchool_R>

    <Icon_L></Icon_L>
    <!-- <Icon_R></Icon_R> -->
    <!-- <Icon_R_Energy></Icon_R_Energy> -->
  </div>
</template>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  z-index: 2;
  position: absolute;
  pointer-events: none;
}
</style>
