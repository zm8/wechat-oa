<template>
  <div class="vxe-table-wrapper-v3">
    <vxe-table3
      border
      height="300"
      :column-config="{ resizable: true }"
      :virtual-y-config="{ enabled: true, gt: 0 }"
      :data="tableData"
    >
      <vxe-column3 type="seq"></vxe-column3>
      <vxe-column3 field="name" title="Name"></vxe-column3>
      <vxe-column3 field="role" title="Role"></vxe-column3>
      <vxe-column3 field="sex" title="Sex"></vxe-column3>
    </vxe-table3>
  </div>
</template>

<script>
import { VxeTable3, VxeColumn3 } from "../../../vxe-table-lib/dist/main.js";
import "../../../vxe-table-lib/dist/style.css";

export default {
  components: {
    VxeTable3,
    VxeColumn3,
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    // 模拟行数据
    loadList(size) {
      setTimeout(() => {
        const dataList = [];
        for (let i = 0; i < size; i++) {
          dataList.push({
            id: i,
            name: "Test" + i,
            role: "Developer",
            sex:
              i === 0
                ? "男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男"
                : "男",
          });
        }
        this.tableData = dataList;
      });
    },
  },
  created() {
    this.loadList(300);
  },
};
</script>
