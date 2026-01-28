<script>
import dialogOpen from "../utils/dialogOpen";
import DialogTest from "./DialogTest.vue";

export default {
  name: "DialogTest",
  components: {
    DialogTest,
  },
  methods: {
    onClick() {
      dialogOpen(
        DialogTest,
        {
          text: "Hello World!",
          onConfirm: (text) => {
            console.log(text);
          },
        },
        { context: this },
      );
    },
  },
};
</script>

<template>
  <div>
    <button @click="onClick">打开弹层</button>
  </div>
</template>
