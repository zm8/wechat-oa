<script setup lang="ts" generic="T, U extends number | string">
import { useResizeObserver } from "@feutopia/vue-hooks";
import { computed, ref, watch } from "vue";

// 列表项位置信息的类型定义
type ItemPositions = {
  uid: number | string;
  height: number;
  top: number;
  bottom: number;
}[];

type ListData = { value: T; uid: U }[];

const props = defineProps<{
  listData: ListData;
  itemSize: number; // 每个列表项的预估高度
}>();

const emit = defineEmits<{ scrollBottom: [] }>();

// DOM 引用
const viewportRef = ref<HTMLElement | null>(null); // 可视区域容器
const listWrapperRef = ref<HTMLElement | null>(null); // 列表包装器

// 视口和滚动相关的状态
const viewportHeight = ref(0); // 视口高度
const scrollPosition = ref(0); // 当前滚动位置
const itemPositions = ref<ItemPositions>([]); // 所有列表项的位置信息

// 位置更新相关的状态
const lastUpdatedIndex = ref(Infinity); // 最后更新的项索引
const heightAdjustment = ref(0); // 高度调整值

// 可视区域的起始和结束索引
const startIndex = ref(0);
const endIndex = ref(0);

const listExtra = ref<HTMLElement | null>(null);
const listExtraHeight = ref(0);

// 计算列表的总高度
const totalHeight = computed(() => {
  const lastItem = itemPositions.value[itemPositions.value.length - 1];
  return (
    (lastItem.bottom ?? 0) + heightAdjustment.value + listExtraHeight.value
  );
});

// 当前需要渲染的列表项, 因为 slice 方法不包括结束索引对应的项，因此需要对结束索引加 1
const visibleItems = computed(() =>
  props.listData.slice(startIndex.value, endIndex.value + 1),
);

// 计算列表的偏移量
const listOffset = computed(
  () => itemPositions.value[startIndex.value]?.top ?? 0,
);

/**
 * 根据滚动位置查找可视区域内的列表项索引
 * @param scrollTop 滚动位置
 * @param direction 查找方向
 * @returns 找到的索引，未找到返回-1
 */
const findVisibleIndex = (scrollTop: number, direction: "down" | "up") => {
  let index = startIndex.value;
  const len = itemPositions.value.length;
  while (index >= 0 && index < len) {
    const currentItem = itemPositions.value[index];
    let top = currentItem.top;
    let bottom = currentItem.bottom;

    // 处理向下滚动时的高度调整
    if (direction === "down" && index >= lastUpdatedIndex.value) {
      top += heightAdjustment.value;
      bottom += heightAdjustment.value;
    }

    const isLast = index === len - 1;
    // 检查当前项是否在指定的滚动位置范围内, 或者已经滚动到底部了
    if (scrollTop >= top && (scrollTop <= bottom || isLast)) {
      return index;
    }

    direction === "down" ? index++ : index--;
  }
  return 0;
};

/**
 * 更新可视区域的起始和结束索引
 * @param scrollTop 滚动位置
 * @param direction 滚动方向
 */
const updateVisibleRange = (scrollTop: number, direction: "up" | "down") => {
  startIndex.value = findVisibleIndex(scrollTop, direction);
  endIndex.value = findVisibleIndex(scrollTop + viewportHeight.value, "down");
};

// 滚动事件处理
const handleScroll = (event: Event) => {
  scrollPosition.value = (event.target as HTMLElement).scrollTop;
  if (totalHeight.value - (scrollPosition.value + viewportHeight.value) < 1) {
    emit("scrollBottom");
  }
};

const getXXX = (list: ListData) => {
  const arr: ItemPositions = [];
  for (let i = 0; i < list.length; i++) {
    const currentItem = list[i];
    const findItem = itemPositions.value.find(
      (item) => item.uid === currentItem.uid,
    );
    const height = findItem?.height ?? props.itemSize;
    const top = i > 0 ? arr[i - 1].bottom : 0;
    const bottom = top + height;
    arr[i] = {
      uid: currentItem.uid,
      height,
      top,
      bottom,
    };
  }
  return arr;
};

/**
 * 重置列表状态
 */
const resetListState = () => {
  startIndex.value = 0;
  lastUpdatedIndex.value = Infinity;
  heightAdjustment.value = 0;
};

/**
 * 更新列表项位置信息
 * 当列表项渲染完成后，根据实际高度更新位置信息
 */
const updateItemPositions = () => {
  const listItems = listWrapperRef.value?.children;
  if (!listItems?.length) return;

  // 获取第一个可见项的 UID 和索引
  const firstVisibleItemUid = listItems[0].getAttribute("data-uid");
  const firstVisibleIndex = itemPositions.value.findIndex(
    (item) => String(item.uid) === firstVisibleItemUid,
  );
  if (firstVisibleIndex === -1) return;

  // 更新可见项的位置信息
  for (let i = firstVisibleIndex; i < itemPositions.value.length; i++) {
    const currentItem = itemPositions.value[i];
    const relativeIndex = i - firstVisibleIndex;

    // 如果不是第一个元素
    if (relativeIndex > 0) {
      // 将当前项的顶部位置设置为前一项的底部位置
      currentItem.top = itemPositions.value[i - 1].bottom;
    }

    // 更新底部位置
    if (listItems[relativeIndex]) {
      currentItem.height = (
        listItems[relativeIndex] as HTMLElement
      ).getBoundingClientRect().height;
      currentItem.bottom = currentItem.top + currentItem.height;
    } else {
      currentItem.bottom = currentItem.top + currentItem.height;
    }

    const isLastItem = i === itemPositions.value.length - 1;

    // 可视区域底部 = 滚动位置 + 视口高度
    const viewportBottom = scrollPosition.value + viewportHeight.value;

    // 检查是否到达可视区域底部
    if (
      viewportBottom >= currentItem.top &&
      (viewportBottom <= currentItem.bottom || isLastItem)
    ) {
      endIndex.value = i;

      // 处理下一项的位置调整
      const nextItem = itemPositions.value[i + 1];
      if (nextItem) {
        if (nextItem.top >= currentItem.bottom) {
          nextItem.top = currentItem.bottom;
          lastUpdatedIndex.value = Infinity;
          heightAdjustment.value = 0;
        } else {
          lastUpdatedIndex.value = i + 1;
          heightAdjustment.value = currentItem.bottom - nextItem.top;
        }
      } else {
        lastUpdatedIndex.value = Infinity;
        heightAdjustment.value = 0;
      }
      break;
    }
  }
};

// 监听滚动位置变化
watch(scrollPosition, (newScrollTop, prevScrollTop) => {
  const direction = newScrollTop - prevScrollTop > 0 ? "down" : "up";
  updateVisibleRange(newScrollTop, direction);
});

// 监听列表容器尺寸变化
useResizeObserver(listWrapperRef, () => {
  updateItemPositions();
});

// 监听视口尺寸变化
useResizeObserver(viewportRef, (entry) => {
  viewportHeight.value = entry[0].contentBoxSize[0].blockSize;
  updateVisibleRange(scrollPosition.value, "down");
});

useResizeObserver(listExtra, (entry) => {
  listExtraHeight.value = entry[0].contentBoxSize[0].blockSize;
});

watch(
  () => props.listData,
  (currentListData) => {
    // 重置列表状态
    resetListState();
    itemPositions.value = getXXX(currentListData);
    // 更新可视区域的起始和结束索引
    updateVisibleRange(scrollPosition.value, "down");
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="virtual-list-viewport" ref="viewportRef" @scroll="handleScroll">
    <!-- 总高度占位元素 -->
    <div
      class="virtual-list-placeholder"
      :style="{ height: `${totalHeight}px` }"
    ></div>

    <!-- 可视列表容器 -->
    <div
      class="virtual-list-wrapper"
      ref="listWrapperRef"
      :style="{ transform: `translate3D(0, ${listOffset}px, 0)` }"
    >
      <div
        class="virtual-list-item"
        v-for="item in visibleItems"
        :data-uid="item.uid"
        :key="item.uid"
      >
        <slot :item="item"></slot>
      </div>
      <div ref="listExtra" class="virtual-list-extra">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-list-viewport {
  position: relative;
  overflow: auto;
  height: 100%;
}

.virtual-list-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
</style>
