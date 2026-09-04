<script setup lang="ts">
import type { HighlightData } from '../types';
import PdfViewer from './PdfViewer.vue';

const props = defineProps<{
  pdfBlob: Blob;
  highlights: HighlightData[];
}>();
</script>

<template>
  <div>
    <h1 class="my-4 text-center text-[20px] font-bold">Pdfjs-Virtual</h1>
    <div class="h-[400px] w-[300px] border">
      <PdfViewer v-if="pdfBlob" :pdf-blob :highlights />
    </div>
  </div>
</template>
