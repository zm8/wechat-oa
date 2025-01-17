<script setup lang="ts" generic="T, U extends number | string">
import { useResizeObserver } from "@feutopia/vue-hooks";
import { computed, reactive, ref, watch } from "vue";

// 列表项位置信息的类型定义
type ItemPositions = {
  uid: number | string;
  height: number;
  top: number;
  bottom: number;
}[];

type ListItem = { value: T; uid: U };

const props = defineProps<{
  items: ListItem[]; // 列表数据
  itemSize: number; // 每个列表项的预估高度
}>();

// 事件定义
const emit = defineEmits<{ scrollBottom: [] }>();

// DOM 引用
const viewportRef = ref<HTMLElement | null>(null); // 可视区域容器
const listWrapperRef = ref<HTMLElement | null>(null); // 列表包装器
const extraContentRef = ref<HTMLElement | null>(null); // 额外内容区域

// 滚动相关状态
const viewportHeight = ref(0); // 视口高度
const scrollTop = ref(0); // 当前滚动位置
const viewportBottom = computed(() => viewportHeight.value + scrollTop.value); // 可视区域底部
const extraContentHeight = ref(0); // 额外内容高度
const itemPositions = ref<ItemPositions>([]); // 列表项位置信息

// 位置更新相关的状态
const initHeightUpdateState = {
  lastUpdatedIndex: Infinity,
  heightAdjustment: 0,
};
const heightUpdateState = reactive({ ...initHeightUpdateState });
const resetHeightUpdateState = () => {
  Object.assign(heightUpdateState, initHeightUpdateState);
};

// 可视区域的起始和结束索引
const startIndex = ref(0);
const endIndex = ref(0);

// 列表的总高度
const totalHeight = computed(() => {
  const lastItem = itemPositions.value[itemPositions.value.length - 1];
  return (
    (lastItem.bottom ?? 0) +
    heightUpdateState.heightAdjustment +
    extraContentHeight.value
  );
});

// 当前需要渲染的列表项
// 因为 slice 方法不包括`结束索引`对应的项，所以`结束索引`需要加 1
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value + 1)
);

// 计算列表的偏移量
const listOffset = computed(
  () => itemPositions.value[startIndex.value]?.top ?? 0
);

/**
 * 根据滚动位置查找可视区域内的列表项索引
 * @param scrollTop 滚动位置
 * @param direction 查找方向
 * @returns 找到的索引，未找到返回-1
 */
const findVisibleIndex = (
  scrollTop: number,
  direction: "down" | "up"
): number => {
  let index = startIndex.value;
  const itemCount = itemPositions.value.length;

  while (index >= 0 && index < itemCount) {
    const isLastItem = index === itemCount - 1;

    let { top, bottom } = itemPositions.value[index];

    // 处理向下滚动时的高度调整
    if (direction === "down" && index >= heightUpdateState.lastUpdatedIndex) {
      top += heightUpdateState.heightAdjustment;
      bottom += heightUpdateState.heightAdjustment;
    }

    // 检查当前项是否在指定的滚动位置范围内, 或者已经滚动到底部了
    if (scrollTop >= top && (scrollTop <= bottom || isLastItem)) {
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

/**
 * 处理滚动事件
 */
const handleScroll = (event: Event) => {
  scrollTop.value = (event.target as HTMLElement).scrollTop;

  // 检查是否滚动到底部
  const isAtBottom = totalHeight.value - viewportBottom.value < 1;
  if (isAtBottom) {
    emit("scrollBottom");
  }
};

/**
 * 初始化列表项位置
 * @param listItems 列表数据
 * @returns 返回初始化的列表项位置数组
 */
const initItemPositions = (listItems: ListItem[]) => {
  const positions: ItemPositions = [];
  for (let i = 0; i < listItems.length; i++) {
    const currentItem = listItems[i];
    const existingItem = itemPositions.value.find(
      (item) => item.uid === currentItem.uid
    );
    const height = existingItem?.height ?? props.itemSize;
    const top = i > 0 ? positions[i - 1].bottom : 0;
    const bottom = top + height;

    positions.push({
      uid: currentItem.uid,
      height,
      top,
      bottom,
    });
  }
  return positions;
};

/**
 * 重置列表状态
 */
const resetListState = () => {
  startIndex.value = 0;
  resetHeightUpdateState();
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
    (item) => String(item.uid) === firstVisibleItemUid
  );

  // 如果没找到
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
    }
    currentItem.bottom = currentItem.top + currentItem.height;

    // 是否最后一项
    const isLastItem = i === itemPositions.value.length - 1;

    // 核心逻辑是维护列表项之间的连续性，当某个列表项的高度发生变化时，需要相应地调整后续项的位置。
    // 检查当前项是否在视口底部范围内，或者是最后一个列表项
    if (
      viewportBottom.value >= currentItem.top &&
      (viewportBottom.value <= currentItem.bottom || isLastItem)
    ) {
      // 更新结束索引为当前项的索引
      endIndex.value = i;

      // 获取下一个列表项
      const nextItem = itemPositions.value[i + 1];
      if (nextItem) {
        // 如果存在下一项
        if (nextItem.top >= currentItem.bottom) {
          // 如果下一项的顶部位置大于当前项的底部
          // 说明中间可能有空隙，需要调整下一项的位置
          nextItem.top = currentItem.bottom;
          // 重置高度更新状态，因为不需要进一步调整
          resetHeightUpdateState();
        } else {
          // 如果下一项的顶部位置小于当前项的底部
          // 说明可能有重叠，需要记录待调整的信息

          // 记录最后更新的索引位置
          heightUpdateState.lastUpdatedIndex = i + 1;

          // 计算需要调整的高度差值
          // 即当前项底部与下一项顶部的差距
          heightUpdateState.heightAdjustment =
            currentItem.bottom - nextItem.top;
        }
      } else {
        // 如果不存在下一项，说明已经处理到列表末尾
        // 重置高度更新状态
        resetHeightUpdateState();
      }
      // 找到目标项后终止循环
      break;
    }
  }
};

// 监听滚动位置变化
watch(scrollTop, (newScrollTop, prevScrollTop) => {
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
  updateVisibleRange(scrollTop.value, "down");
});

// 监听额外内容尺寸变化
useResizeObserver(extraContentRef, (entry) => {
  extraContentHeight.value = entry[0].contentBoxSize[0].blockSize;
});

// 监听 Items 变化，重置状态并更新可视区域
watch(
  () => props.items,
  (currentListData) => {
    // 重置列表状态
    resetListState();
    itemPositions.value = initItemPositions(currentListData);
    // 更新可视区域的起始和结束索引
    updateVisibleRange(scrollTop.value, "down");
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="virtual-list-viewport" ref="viewportRef" @scroll="handleScroll">
    <!-- 总高度占位 -->
    <div
      class="virtual-list-placeholder"
      :style="{ height: `${totalHeight}px` }"
    ></div>

    <!-- 可视列表区域 -->
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
      <div ref="extraContentRef" class="virtual-list-extra">
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
  right: 0;
  top: 0;
  z-index: -1;
}
</style>
