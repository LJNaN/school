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
import SmartSecurity_L from "@/components/SmartSecurity_L.vue";
import SmartSecurity_R from "@/components/SmartSecurity_R.vue";
import SmartEnergy_L from "@/components/SmartEnergy_L.vue";
import SmartEnergy_R from "@/components/SmartEnergy_R.vue";
import SmartEducationInner_L from "@/components/SmartEducationInner_L.vue";
import SmartEducationInner_R from "@/components/SmartEducationInner_R.vue";
import SmartEducationOuter_L from "@/components/SmartEducationOuter_L.vue";
import SmartEducationOuter_R from "@/components/SmartEducationOuter_R.vue";

import Echarts from "@/components/Echarts.vue";
const leftRef = ref(null);

onMounted(() => {
  
});
</script>

<template>
  <div class="home">
    <Head></Head>
    <Foot></Foot>
    <SmartSchool_L></SmartSchool_L>
    <SmartSchool_R></SmartSchool_R> 
    <!-- <SmartEducationInner_L></SmartEducationInner_L>
    <SmartEducationInner_R></SmartEducationInner_R> -->
    <!-- <SmartEducationOuter_L></SmartEducationOuter_L> -->
    <!-- <SmartEducationOuter_R></SmartEducationOuter_R> -->
    <!-- <SmartSecurity_L></SmartSecurity_L> -->
    <!-- <SmartSecurity_R></SmartSecurity_R> -->
    <!-- <SmartEnergy_L></SmartEnergy_L> -->
    <!-- <SmartEnergy_R></SmartEnergy_R> -->
    <Icon_L></Icon_L>
    <Icon_R></Icon_R>
    <!-- <Icon_R_Energy></Icon_R_Energy> -->
    <!-- <Echarts></Echarts> -->
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
