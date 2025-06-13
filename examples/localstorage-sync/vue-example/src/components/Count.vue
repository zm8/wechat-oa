<script setup lang="ts">
import { useSyncedLocalStorage } from "../hooks/useSyncedLocalStorage";

const { value, setValue } = useSyncedLocalStorage("a", 0);

const increace = () => {
  setValue(value.value + 1);
};
</script>

<template>
  <button @click="increace">{{ value }}</button>
</template>
