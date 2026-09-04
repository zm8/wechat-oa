<template>
  <div class="relative h-full bg-[#D4D4D7]">
    <!-- 独立的悬浮缩放控制栏 -->
    <PdfZoomControls @zoom-in="zoomIn" @zoom-out="zoomOut" />

    <!-- Pdf 容器 -->
    <div ref="viewerContainerRef" class="absolute inset-0 overflow-auto">
      <!-- pdfjs 内部需要使用 class pdfViewer  -->
      <div ref="viewerRef" class="pdfViewer"></div>
    </div>

    <!-- 使用 Teleport 将高亮组件直接“传送”到对应 PDF 页面的 DOM 节点中 -->
    <Teleport v-for="page in activePageHighlights" :key="page.pageNo" :to="page.container">
      <PdfHighlightLayer :highlights="page.highlights" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import * as pdfjsViewer from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import PdfHighlightLayer from './PdfHighlightLayer.vue';
import PdfZoomControls from './PdfZoomControls.vue';
import type {
  ActivePageHighlights,
  HighlightsList,
  PageRenderedEvent,
  PageView,
} from '../types.ts';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const props = defineProps<{
  pdfBlob: Blob;
  highlights: HighlightsList;
}>();

let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
let pdfViewer: pdfjsViewer.PDFViewer | null = null;
let eventBus: pdfjsViewer.EventBus | null = null;
let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
let minScale = 1;
let maxScale = 1;
let scaleDelta = 1;

const viewerContainerRef = useTemplateRef('viewerContainerRef');
const viewerRef = useTemplateRef('viewerRef');
const activePageHighlights = ref<ActivePageHighlights>([]);

const getHighlightsForPage = (pageNo: number) => {
  return props.highlights.filter((hl) => hl.pageNo === pageNo);
};

// 放大
const zoomIn = () => {
  if (!pdfViewer) return;
  const newScale = pdfViewer.currentScale * scaleDelta;
  pdfViewer.currentScaleValue = Math.min(maxScale, newScale).toString();
};

// 缩小
const zoomOut = () => {
  if (!pdfViewer) return;
  const newScale = pdfViewer.currentScale / scaleDelta;
  pdfViewer.currentScaleValue = Math.max(minScale, newScale).toString();
};

const setExactFitScale = () => {
  if (!pdfViewer || !viewerContainerRef.value) return;
  const firstPage = pdfViewer.getPageView(0);
  if (firstPage) {
    const baseWidth = firstPage.viewport.width / firstPage.scale;
    const containerWidth = viewerContainerRef.value.clientWidth;

    minScale = containerWidth / baseWidth;
    maxScale = minScale * 3;
    scaleDelta = Math.pow(maxScale / minScale, 1 / 4);
    pdfViewer.currentScale = minScale;
  }
};

const renderHighlights = (pageView: PageView) => {
  if (!pageView.id) return;

  const pageNo = pageView.id - 1;
  const pageDiv = pageView.div;
  const pageHighlights = getHighlightsForPage(pageNo);

  // 1. 移除当前页旧的 Teleport 目标数据
  activePageHighlights.value = activePageHighlights.value.filter((item) => item.pageNo !== pageNo);

  if (pageHighlights.length === 0) return;

  // 2. 确保 pageDiv 内部有一个固定挂载容器
  let container = pageDiv.querySelector('.pdf-teleport-container') as HTMLElement;
  if (!container) {
    container = document.createElement('div');
    container.className = 'pdf-teleport-container absolute inset-0 pointer-events-none z-10';
    pageDiv.appendChild(container);
  }

  // 3. 推入响应式数组，Vue 会自动触发 Teleport 进行渲染
  activePageHighlights.value.push({
    pageNo,
    container,
    highlights: pageHighlights,
  });
};

// ======================= 核心渲染与初始化 =======================

const initViewer = () => {
  if (!viewerContainerRef.value || !viewerRef.value) return;

  eventBus = new pdfjsViewer.EventBus();

  pdfViewer = new pdfjsViewer.PDFViewer({
    container: viewerContainerRef.value,
    viewer: viewerRef.value,
    eventBus,
  });

  eventBus.on('pagesinit', function () {
    setExactFitScale();
    if (pdfViewer && props.highlights.length > 0) {
      const firstPageNo = props.highlights[0].pageNo + 1;
      pdfViewer.currentPageNumber = firstPageNo;
    }
  });

  eventBus.on('pagerendered', (evt: PageRenderedEvent) => {
    renderHighlights(evt.source);
  });
};

const loadPdf = async () => {
  try {
    const arrayBuffer = await props.pdfBlob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    loadingTask = pdfjsLib.getDocument({
      data,
      cMapUrl: `${import.meta.env.BASE_URL}cmaps/`,
      cMapPacked: true,
    });

    pdfDocument = await loadingTask.promise;
    pdfViewer?.setDocument(pdfDocument);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  initViewer();
  loadPdf();
});

onUnmounted(() => {
  activePageHighlights.value = [];

  if (eventBus) {
    eventBus = null;
  }

  if (pdfViewer) {
    pdfViewer.cleanup();
    pdfViewer = null;
  }

  if (pdfDocument) {
    pdfDocument.destroy();
    pdfDocument = null;
  }

  if (loadingTask) {
    loadingTask.destroy();
    loadingTask = null;
  }
});
</script>
