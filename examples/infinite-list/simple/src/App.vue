<script setup lang="ts">
import { faker } from "@faker-js/faker";
import { ref } from "vue";
import InfiniteListAdvance from "./components/InfiniteList/index.vue";

const data = ref<{ value: string; uid: number }[]>([]);

for (let i = 100; i < 1000; i++) {
  data.value.push({
    uid: i,
    value: faker.lorem.sentences(),
  });
}
</script>

<template>
  <InfiniteListAdvance :listData="data" :itemSize="100"></InfiniteListAdvance>
</template>
