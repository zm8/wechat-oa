<template>
  <div class="relative size-full">
    <div
      v-for="(hl, index) in highlights"
      :key="index"
      class="absolute bg-[#EF663C59]"
      :style="getHighlightStyle(hl)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { HighlightData, HighlightsList } from '../types';

defineProps<{
  highlights: HighlightsList;
}>();

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
</script>
