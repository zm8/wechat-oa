<template>
  <el-dialog title="提示" visible width="30%" @close="doClose" append-to-body>
    <span>{{ text }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doCancle">取消</el-button>
      <el-button type="primary" @click="doConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogTest",
  props: {
    text: String,
  },
  methods: {
    doClose() {
      this.$emit("close");
    },
    doCancle() {
      this.doClose();
    },
    doConfirm() {
      this.$emit("confirm", "点击确认按钮");
      this.doClose();
    },
  },
};
</script>
