<!-- FormBox.vue -->
<script setup lang="ts">
import { ref } from "vue";
import FormSimple from "./FormSimple.vue";
import FormComplex from "./FormComplex.vue";

const activeKey = ref("1");
</script>

<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="基础表单">
      <FormSimple />
    </a-tab-pane>
    <a-tab-pane key="2" tab="复杂联动表单">
      <FormComplex />
    </a-tab-pane>
  </a-tabs>
</template>
