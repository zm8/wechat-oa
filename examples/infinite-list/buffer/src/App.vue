<script setup lang="ts">
import { faker } from "@faker-js/faker";
import { ref } from "vue";
import InfiniteList from "./components/InfiniteList/index.vue";

const data = ref<{ value: string; uid: number }[]>([]);

for (let i = 0; i < 1000; i++) {
  data.value.push({
    uid: i + 1,
    value: faker.lorem.sentences(2),
  });
}
</script>

<template>
  <InfiniteList :listData="data" :itemSize="100"></InfiniteList>
</template>
