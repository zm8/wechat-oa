<script setup lang="ts" generic="T, U extends number | string">
import { computed, onMounted, ref } from "vue";

// 定义组件的 props
const props = withDefaults(
  defineProps<{
    listData: { value: T; uid: U }[]; // 列表数据，每项包含值和唯一标识符
    itemSize: number; // 每项的高度
    bufferCount?: number; // 缓冲区的数量
  }>(),
  {
    bufferCount: 2, // 缓冲区的数量，默认值2
  }
);

// 屏幕高度（用于计算可视区域的显示数量）
const screenHeight = ref(0);
// 当前滚动距离（顶部到当前可视区域顶部的距离）
const scrollTop = ref(0);
// 列表容器的引用，用于获取容器的实际高度
const containerRef = ref<HTMLElement | null>(null);

// 列表总数量
const totalListHeight = computed(() => props.listData.length);

// 列表容器的总高度，计算方法为：总数量 * 每项高度
const containerHeight = computed(() => totalListHeight.value * props.itemSize);

// 可视区域显示的数量，取决于屏幕高度和每项的高度
const visibleCount = computed(() =>
  Math.ceil(screenHeight.value / props.itemSize)
);

// 当前滚动位置对应的起始索引
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemSize));

// 当前滚动位置对应的结束索引，基于起始索引和可视数量
const endIndex = computed(() => startIndex.value + visibleCount.value);

// 当前需要渲染的列表项，基于起始索引和结束索引
const renderedItems = computed(() =>
  props.listData.slice(startIndex.value, endIndex.value)
);

// 偏移位置，用于调整显示位置，使列表与滚动位置对齐
const offset = computed(() => startIndex.value * props.itemSize);

// 滚动事件处理函数，更新当前滚动位置
const handleScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop;
};

// 组件挂载后，初始化屏幕高度
onMounted(() => {
  screenHeight.value = containerRef.value?.clientHeight ?? 0;
});
</script>

<template>
  <!-- 列表容器，监听滚动事件 -->
  <div class="infinite-container" ref="containerRef" @scroll="handleScroll">
    <!-- 占位区域，用于模拟完整列表的高度 -->
    <div
      class="infinite-placeholder"
      :style="{ height: `${containerHeight}px` }"
    ></div>
    <!-- 实际渲染的内容，根据偏移量动态调整位置 -->
    <div :style="{ transform: `translate3D(0, ${offset}px, 0)` }">
      <!-- 渲染的列表项 -->
      <div
        class="infinite-item"
        v-for="item in renderedItems"
        :key="item.uid"
        :style="{ height: `${props.itemSize}px` }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 列表容器样式 */
.infinite-container {
  border: 1px solid red; /* 红色边框，用于调试 */
  position: relative; /* 相对定位 */
  overflow: auto; /* 可滚动 */
  height: 100%; /* 占满父容器高度 */
}

/* 占位元素样式，用于模拟完整列表高度 */
.infinite-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1; /* 放在内容后面 */
}

/* 列表项样式 */
.infinite-item {
  border-bottom: 1px solid blue; /* 每项底部的蓝色边框 */
}
</style>
