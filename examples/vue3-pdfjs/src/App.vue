<script setup lang="ts">
import PdfVirtual from './components/PdfVirtual/index.vue';
import PdfOfficial from './components/PdfOfficial/index.vue';
import { ref } from 'vue';
import type { HighlightData } from './components/types.ts';
import pdfUrl from '@/assets/1.pdf?url';

const highlights = ref<HighlightData[]>([
  {
    bbox: [14, 502, 653, 702],
    pageNo: 8,
    pageSize: [675.1199951171875, 900],
  },
]);
const pdfBlob = ref<Blob | null>(null);

async function getPdfBlob() {
  const res = await fetch(pdfUrl);
  const blob = await res.blob();
  return blob;
}

async function init() {
  pdfBlob.value = await getPdfBlob();
}

init();
</script>

<template>
  <div class="flex gap-[100px] mx-10">
    <PdfVirtual v-if="pdfBlob" :pdfBlob :highlights />
    <PdfOfficial v-if="pdfBlob" :pdfBlob :highlights />
  </div>
</template>
