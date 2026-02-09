<script lang="ts" setup>
import TableBigData from './components/TableBigData/index.vue';
import VertualListTable from './components/VirtualListTable/index.vue';
import { faker } from '@faker-js/faker';
import { onMounted, ref } from 'vue';
import type { TableData } from './components/TableBigData/types';

const tableBigData = ref<TableData>([]);
const tableRenderData = ref<TableData>([]);

const initData = () => {
  const arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push({
      id: crypto.randomUUID(),
      name: i + 1 + '. ' + faker.internet.username(),
      email: faker.internet.email(),
    });
  }
  tableBigData.value = arr;
};

onMounted(() => {
  initData();
});

const renderVirtualData = (data: TableData) => {
  tableRenderData.value = data;
};
</script>

<template>
  <VertualListTable :list-data="tableBigData" @change="renderVirtualData">
    <TableBigData :data="tableRenderData" />
  </VertualListTable>
</template>
