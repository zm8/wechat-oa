<!--
  loading 动画组件
  @file directive/loading/Loading.vue
-->

<script setup lang="ts">
import { computed } from "vue";
import type { LoadingProps } from "./types";

// 定义组件的 props，支持传递大小、颜色和是否显示
const props = withDefaults(defineProps<Partial<LoadingProps>>(), {
  isVisible: true,
  size: 30,
  color: "#25b09b",
});

// 计算加载动画的实际大小（单位：px）
const sizePx = computed(() => props.size + "px");
</script>

<template>
  <div class="loader-box" v-if="isVisible">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader-box {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.loader {
  width: v-bind("sizePx");
  height: v-bind("sizePx");
  background: v-bind("color");
  padding: 4px;
  border-radius: 50%;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
