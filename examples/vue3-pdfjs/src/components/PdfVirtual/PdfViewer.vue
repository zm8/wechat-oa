@@ -1,105 +0,0 @@
<template>
  <div class="h-full">
    <div v-if="!pdfDoc" class="flex h-full items-center justify-center text-xl">加载中...</div>

    <DynamicScroller
      v-if="pdfDoc"
      ref="scrollerRef"
      key-field="pageIndex"
      :items="pages"
      :min-item-size="itemSize"
      class="h-full bg-[#D4D4D7] p-1"
    >
      <template #default="{ item, active, index }">
        <DynamicScrollerItem :item :active>
          <PdfPage
            :page-index="item.pageIndex"
            :pdf-doc="pdfDoc"
            :highlights="getHighlightsForPage(item.pageIndex)"
            :is-last="index === pages.length - 1"
          />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';
import { nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import PdfPage from './PdfPage.vue';
import type { HighlightData } from '../types.ts';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const props = defineProps<{
  pdfBlob: Blob;
  highlights: HighlightData[];
}>();

const pdfDoc = shallowRef<pdfjsLib.PDFDocumentProxy | null>(null);
const itemSize = ref(window.innerWidth / 0.75); // 大约是 A4 纸的高度
const scrollerRef = useTemplateRef('scrollerRef');
const pages = ref<{ pageIndex: number }[]>([]); // 虚拟列表数据源

// 获取某页的高亮数据
const getHighlightsForPage = (pageIndex: number) => {
  return props.highlights.filter((hl) => hl.pageNo === pageIndex);
};

// 滚动到第一个高亮所在的页面
const scrollToFirstHighlight = () => {
  const pageNo = props.highlights[0]?.pageNo;
  if (pageNo) {
    nextTick(() => {
      scrollerRef.value?.scrollToItem(pageNo);
    });
  }
};

/*
  1. 加载 PDF
  2. 滚动到第一个高亮所在的页面 - scrollToFirstHighlightPage
  3. 等待目标页面渲染完成 - handlePageRendered
  4. 滚动到页面内的具体高亮位置 - PdfPage.scrollToFirstHighlight
*/
const loadPdf = async () => {
  try {
    const arrayBuffer = await props.pdfBlob.arrayBuffer();
    pdfDoc.value = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl: '/cmaps/',
      cMapPacked: true,
    }).promise;

    pages.value = Array.from({ length: pdfDoc.value.numPages }, (_, i) => ({
      pageIndex: i,
    }));

    scrollToFirstHighlight();
  } catch (error) {
    console.error(error);
  }
};

const scrollToFirstPage = () => {
  scrollerRef.value?.scrollToItem(0);
};

defineExpose({
  scrollToFirstPage,
});

onMounted(() => loadPdf());
</script>
