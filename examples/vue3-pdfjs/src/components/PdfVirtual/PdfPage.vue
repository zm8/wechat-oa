<template>
  <!-- 隔离 padding，保证 relative 容器尺寸与 canvas 严格一致，防止高亮坐标错位 -->
  <div class="select-none" :class="{ 'pb-2': !isLast }">
    <div class="relative">
      <canvas ref="canvasRef" class="block w-full"></canvas>
      <div class="pointer-events-none absolute inset-0" :class="{ invisible: !loaded }">
        <div
          v-for="(hl, index) in highlights"
          :key="index"
          class="absolute z-10 bg-[#EF663C59]"
          :style="getHighlightStyle(hl)"
        ></div>
      </div>
      <!-- 用于触发 DynamicScrollerItem 重新测量 -->
      <div v-show="sizeTrigger" class="h-px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { onUnmounted, ref, useTemplateRef } from 'vue';

interface HighlightData {
  bbox: [number, number, number, number];
  pageNo: number;
  pageSize: [number, number];
}

const props = defineProps<{
  pageIndex: number;
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  highlights: HighlightData[];
  isLast: boolean;
}>();

let renderTask: pdfjsLib.RenderTask | null = null;
let pageInstance: pdfjsLib.PDFPageProxy | null = null; // 新增：保存页面实例用于清理
let currentRenderId = 0;

const canvasRef = useTemplateRef('canvasRef');
const sizeTrigger = ref(false);
const triggeredPages = new Set<number>();
const loaded = ref(false);

const triggerSizeUpdate = () => {
  if (triggeredPages.has(props.pageIndex)) return;

  triggeredPages.add(props.pageIndex);

  sizeTrigger.value = true;

  requestAnimationFrame(() => {
    sizeTrigger.value = false;
  });
};

const getHighlightStyle = (hl: HighlightData) => {
  const [left, top, right, bottom] = hl.bbox;
  const [pageWidth, pageHeight] = hl.pageSize;
  return {
    left: `${(left / pageWidth) * 100}%`,
    top: `${(top / pageHeight) * 100}%`,
    width: `${((right - left) / pageWidth) * 100}%`,
    height: `${((bottom - top) / pageHeight) * 100}%`,
  };
};

const cleanupMemory = () => {
  if (renderTask) {
    renderTask.cancel();
    renderTask = null;
  }
  if (pageInstance) {
    pageInstance.cleanup();
    pageInstance = null;
  }
};

const renderPage = async () => {
  if (!canvasRef.value || !props.pdfDoc) return;

  const renderId = ++currentRenderId;

  // 渲染前清理内存与旧任务
  cleanupMemory();

  try {
    const page = await props.pdfDoc.getPage(props.pageIndex + 1);

    // 拦截过期请求
    if (renderId !== currentRenderId) {
      console.warn(`[ID:${renderId}] 🛑 丢弃已过期请求: pageIndex ${props.pageIndex}`);
      page.cleanup();
      return;
    }

    pageInstance = page;
    const viewport = page.getViewport({ scale: 2 });
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderTask = page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    });

    await renderTask.promise;

    loaded.value = true;

    triggerSizeUpdate();
  } catch (err: any) {
    if (err?.name !== 'RenderingCancelledException') {
      console.error(`❌ 渲染 pageIndex ${props.pageIndex} 出错:`, err);
    }
  }
};

watchDebounced(
  () => props.pageIndex,
  () => {
    renderPage();
  },
  {
    debounce: 50, // 防抖延迟 50ms
    immediate: true, // 初始挂载时也会触发一次
    flush: 'post', // 确保在 DOM 更新后执行
  },
);

onUnmounted(() => {
  cleanupMemory();
});
</script>
