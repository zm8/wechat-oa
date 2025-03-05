<script setup lang="ts">
import LightComponent from "./LightComponent.vue";
import DarkComponent from "./DarkComponent.vue";
import { useTheme } from "../hooks/useTheme";

const { isLightTheme } = useTheme();
</script>

<template>
  <!-- 根据主题显示不同组件 -->
  <LightComponent v-if="isLightTheme" />
  <DarkComponent v-else />
</template>
