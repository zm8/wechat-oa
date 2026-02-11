<script lang="ts" setup>
import type { TableData } from './types';

defineOptions({
  name: 'TableBigData',
});

defineProps<{ data: TableData }>();
</script>

<template>
  <el-table :data border>
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="email" label="Email" />
  </el-table>
</template>
