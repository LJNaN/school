<script setup>
import { reactive, ref, computed, toRefs, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2]
</script>
<template>
    <ul class="container">
        <div class="scroll-list">
            <li v-for="(item, index) in items" :key="index">{{ item }}</li>
        </div>
    </ul>
</template>

<style scoped lang ='scss'>
.container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(-50px) translateY(-30px);
    list-style: none;
    border: 1px solid red;
    height: 60px;
    width: 100px;
    margin: 0;
    padding: 0;
    position: relative;
    overflow: hidden;

    .scroll-list {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        animation: scroll 6s linear infinite normal;
    }

    li {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :nth-child(n) {
        background-color: #ffd5a2;
    }

    :nth-child(2n) {
        background-color: #add5a2;
    }
}

@keyframes scroll {
    100% {
        /* 需要滚动内容的总高度 */
        top: -300px;
    }
}
</style>