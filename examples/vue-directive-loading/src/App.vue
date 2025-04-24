<!-- App.vue -->
<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true); // loading 用来控制加载动画显示
const isVisible = ref(true); // isVisible 用来控制组件销毁
</script>

<template>
  <!-- 控制加载动画的显示/隐藏 -->
  <button @click="loading = !loading">toggle visible</button>
  &nbsp;
  <!-- 控制组件的销毁 -->
  <button @click="isVisible = !isVisible">toggle destroy</button>

  <!-- 显示加载动画的区域 -->
  <div
    v-if="isVisible"
    v-loading="loading"
    loading-color="red"
    loading-size="60"
    class="section"
  ></div>
</template>

<style scoped>
.section {
  width: 200px;
  height: 200px;
  border: 1px solid red;
  margin-top: 20px;
}
</style>
