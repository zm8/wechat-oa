<script lang="ts" setup>
import { faker } from '@faker-js/faker';
import { onMounted, reactive } from 'vue';

defineOptions({
  name: 'TableBigData',
});

const tableData = reactive<{ name: string; email: string; id: string }[]>([]);

const initTableData = () => {
  let j = 10;
  while (j--) {
    tableData.push({
      id: crypto.randomUUID(),
      name: faker.internet.username(),
      email: faker.internet.email(),
    });
  }
};

onMounted(() => {
  initTableData();
});
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="email" label="Email" />
  </el-table>
</template>
