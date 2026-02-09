<script setup lang="ts" generic="T">
import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  onUpdated,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import type { Props, Positions } from './types';

defineOptions({
  name: 'VirtualListTable',
});

const props = withDefaults(defineProps<Props<T>>(), {
  estimatedItemSize: 40,
  bufferCount: 10,
  height: 500,
});

const emits = defineEmits();

/******************** var ********************/
const start = ref(0);
let cacheHeight = new Map<string | number, number>();
let positions: Positions = [];
let ignoreResize = false;
let unlockTimer: null | number = null;
let isActive = true;
let scrollTop = 0;
let ro: null | ResizeObserver;

const containerRef = useTemplateRef<HTMLElement>('container');
const scrollBoxRef = useTemplateRef<HTMLElement>('scrollBox');
const contentRef = useTemplateRef<HTMLElement>('content');
const placeholderRef = useTemplateRef<HTMLElement>('placeholder');

/******************** computed ********************/
// 可视数量
const visibleCount = computed(() => Math.ceil(props.height / props.estimatedItemSize));

const visibleData = computed(() => {
  // 最小值是 0
  const startIndex = Math.max(start.value - props.bufferCount, 0);
  // 最大值为 this.listData.length
  const endIndex = Math.min(
    start.value + visibleCount.value + props.bufferCount,
    props.listData.length,
  );
  return props.listData.slice(startIndex, endIndex);
});

/******************** methods ********************/
// 更新布局
const updateLayout = () => {
  updateItemsSize(); // 更新列表尺寸
  updateTotalHeight(); // 更新整体高度
  setStartOffset(); // 设置偏移量
};

// 释放 resize 锁
const releaseResizeLock = () => {
  clearUnlockTimer();
  unlockTimer = setTimeout(() => {
    ignoreResize = false;
    unlockTimer = null;
  }, 0);
};

// 初始化元素
const initElement = () => {
  const $wrapper = containerRef.value?.querySelector('.el-table__body-wrapper');
  const $tableBody = $wrapper?.querySelector('.el-scrollbar');
  if ($tableBody) {
    contentRef.value?.appendChild($tableBody);
  }
  if (scrollBoxRef.value) {
    $wrapper?.appendChild(scrollBoxRef.value);
  }
};

const addEvent = () => {
  // 忽略首次执行
  let skipFirst = true;
  ro = new ResizeObserver(() => {
    if (skipFirst) {
      skipFirst = false;
      return;
    }
    onResize();
  });
  if (contentRef.value) {
    ro.observe(contentRef.value);
  }
};

const removeEvent = () => {
  if (ro) {
    ro.disconnect();
    ro = null;
  }
};

const clearUnlockTimer = () => {
  if (unlockTimer) {
    clearTimeout(unlockTimer);
    unlockTimer = null;
  }
};

const isElementInHTML = (el: HTMLElement | null) => {
  return el instanceof Node && document.documentElement.contains(el);
};

const getNodes = () => scrollBoxRef.value?.querySelectorAll('tbody tr') ?? [];

const onResize = () => {
  if (ignoreResize) return; // 忽略此次 Resize
  if (!isElementInHTML(scrollBoxRef.value)) return;
  getNodes().forEach((node) => {
    const id = getNodeId(node);
    if (id) {
      cacheHeight.delete(id);
    }
  });
  updateLayout();
};

// 监听滚动事件
const onScrollEvent = (e: Event) => {
  const target = e.target as HTMLDivElement;
  scrollTop = target.scrollTop;
  start.value = getStartIndex(positions, scrollTop);
  setStartOffset();
};

// 重建 positions
const rebuildPositions = () => {
  const newCacheHeight = new Map();
  positions = [];
  props.listData.forEach((item, index) => {
    const height = props.estimatedItemSize;
    if (cacheHeight.has(item.id)) {
      newCacheHeight.set(item.id, height);
    }
    positions[index] = {
      id: item.id,
      height,
      top: index * height,
    };
  });
  cacheHeight = newCacheHeight;
};

// 防止 start 越界
const fixStartIndex = () => {
  if (start.value >= props.listData.length) {
    start.value = Math.max(props.listData.length - 1, 0);
  }
};

// 二分法查找 startIndex
const getStartIndex = (list: Positions, scrollTop: number) => {
  let index: null | number = null;
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    // 防止溢出写法，等同于 Math.floor((low + hight) / 2)
    const mid = low + ((high - low) >> 1);
    const midVal = list[mid]?.top;
    if (midVal && midVal <= scrollTop) {
      index = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return index ?? 0;
};

// 设置 content 偏移
const setStartOffset = () => {
  const index = Math.max(start.value - props.bufferCount, 0);
  const offset = positions[index]?.top ?? 0;
  if (contentRef.value) {
    contentRef.value.style.transform = `translate3d(0, ${offset}px, 0)`;
  }
};

const getNodeId = (node: Element) => {
  const ID = 'id-';
  const id = node.className
    ?.split(' ')
    ?.find((item) => item.indexOf(ID) > -1)
    ?.slice(ID.length);
  return Number(id);
};

// 更新真实的高度
const updateItemsSize = () => {
  const nodes = getNodes();
  nodes.forEach((node) => {
    const id = getNodeId(node);
    if (!id) return;
    const index = positions.findIndex((item) => item.id === id);
    const item = positions[index];
    if (!item) return;

    const height = cacheHeight.has(id) ? cacheHeight.get(id) : node.getBoundingClientRect().height;
    if (height === undefined) return;

    cacheHeight.set(id, height);
    const oldHeight = item.height;
    const dValue = height - oldHeight;
    if (dValue) {
      item.height = height;
      for (let k = index + 1; k < positions.length; k++) {
        const item = positions[k];
        if (item) {
          item.top += dValue;
        }
      }
    }
  });
};

// 更新总高度
const updateTotalHeight = () => {
  const lastItem = positions[positions.length - 1];
  const totalHeight = lastItem ? lastItem.top + lastItem.height : 0;
  if (placeholderRef.value) {
    placeholderRef.value.style.height = totalHeight + 'px';
  }
};

const resetScroll = () => {
  scrollTop = 0;
  if (scrollBoxRef.value) {
    scrollBoxRef.value.scrollTop = 0;
  }
};

/******************** watch ********************/
watch(
  visibleData,
  (val) => {
    emits('change', val);
  },
  {
    immediate: true,
  },
);

watch(
  props.listData,
  () => {
    fixStartIndex();
    rebuildPositions();
    // 由于 potisions 发生变化, 所以这里需要重置 start
    start.value = getStartIndex(positions, scrollTop);
  },
  {
    immediate: true,
  },
);

/******************** lifeCycle  ********************/

onActivated(() => {
  if (isActive) return;
  isActive = true;
  if (scrollBoxRef.value) {
    scrollBoxRef.value.scrollTop = scrollTop;
  }
  ignoreResize = true;
  nextTick(() => {
    releaseResizeLock();
  });
});

onDeactivated(() => {
  isActive = false;
});

// 监听更新
onUpdated(() => {
  ignoreResize = true;
  nextTick(() => {
    updateLayout();
    releaseResizeLock();
  });
});

// 卸载前
onBeforeUnmount(() => {
  clearUnlockTimer();
  removeEvent();
});

// 挂载
onMounted(() => {
  initElement();
  addEvent();
  updateLayout();
});

/******************** expose  ********************/
defineExpose({
  resetScroll,
});
</script>

<template>
  <div ref="container">
    <slot></slot>
    <div
      ref="scrollBox"
      @scroll="onScrollEvent"
      class="scrollBox"
      :style="{ maxHeight: height + 'px' }"
    >
      <div ref="content"></div>
      <div ref="placeholder" class="placeholder"></div>
    </div>
  </div>
</template>

<style scoped>
.scrollBox {
  position: relative;
  overflow: hidden auto;
}

.placeholder {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
  pointer-events: none;
}
</style>
