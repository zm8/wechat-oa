<script lang="ts" setup>
import TableBigData from './components/TableBigData/index.vue';
import VertualListTable from './components/VirtualListTable/index.vue';
import { faker } from '@faker-js/faker';
import { reactive, ref } from 'vue';
import type { TableData } from './components/TableBigData/types';

const tableBigData = reactive<TableData>([]);
const tableData = ref<TableData>([]);

const initData = () => {
  for (let i = 0; i < 100; i++) {
    tableBigData.push({
      id: crypto.randomUUID(),
      name: i + 1 + '. ' + faker.internet.username(),
      email: faker.internet.email(),
    });
  }
};

initData();

const renderVirtualData = (data: TableData) => {
  tableData.value = data;
};
</script>

<template>
  <VertualListTable :list-data="tableBigData" @change="renderVirtualData">
    <TableBigData :data="tableData" />
  </VertualListTable>
</template>
