<script setup>
import { reactive, ref, computed, toRefs, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
const videoUrl = defineProps({ url: String })


</script>
<template>
    <video class="video" :src="videoUrl.url" muted autoplay>
    </video>
</template>

<style scoped lang ='scss'>
.video {
    width: 100%;
    height: 100%;
    object-fit: fill; //解决video标签是不会自动铺满整个div
}
</style>