<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  value: string;
  uid: number;
}>();

const isShow = ref(false);
const toggle = () => {
  isShow.value = !isShow.value;
};
</script>

<template>
  <div class="item">
    <span class="no">{{ uid }}.</span> {{ value }}
    <div v-if="isShow">我长高了, 哈哈哈哈...🎉🎉🎉</div>
    <div class="btns-wrap">
      <button @click="$emit('remove', uid)">移除</button>
      <button @click="toggle">{{ isShow ? "恢复" : "变高" }}</button>
    </div>
  </div>
</template>

<style scoped>
.item {
  border-bottom: 1px solid blue;
  padding: 10px 5px;
  .no {
    color: red;
  }
}

.btns-wrap {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  button {
    padding: 3px 10px;
    border: 1px solid green;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: red;
      color: #fff;
    }
  }
}
</style>
