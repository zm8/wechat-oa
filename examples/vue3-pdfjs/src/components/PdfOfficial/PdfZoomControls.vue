<template>
  <div class="absolute bottom-20 right-4 z-50 flex flex-col gap-4">
    <div class="btn-zoom" @click="$emit('zoom-in')">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#333"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    </div>
    <div class="btn-zoom" @click="$emit('zoom-out')">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#333"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'zoom-in'): void;
  (e: 'zoom-out'): void;
}>();
</script>

<style scoped>
.btn-zoom {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors active:bg-gray-200;
}
</style>
