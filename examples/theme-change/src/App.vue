<script setup lang="ts">
import Card from "./components/Card.vue";
import CompBox from "./components/CompBox.vue";
import { useTheme } from "./hooks/useTheme";

const { toggleTheme, isLightTheme } = useTheme();
</script>

<template>
  <button @click="toggleTheme">
    {{ isLightTheme ? "🌞 切暗黑" : "🌙 切浅色" }}
  </button>
  <Card />
  <CompBox />
</template>

<style scoped>
button {
  background: #4096ff;
  color: #fff;
  margin: 20px auto;
  display: block;
}
</style>
