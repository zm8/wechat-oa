<script setup lang="ts" generic="T extends string, K extends Record<T, any>">
import { computed, ref, type Component } from "vue";
import { Input, Select, TimePicker, type FormInstance } from "ant-design-vue";
import type { FormConfig, FormField, FormFooter } from ".";
import type { NamePath } from "ant-design-vue/es/form/interface";

const props = defineProps<{
  modelValue: K;
  fields: FormField<T>[];
  formActions: FormConfig<K>;
  formFooter: FormFooter[];
}>();

// 自动分组逻辑
const groupedFields = computed(() => {
  const rows: FormField<T>[][] = [[]];
  let currentSpan = 0;

  props.fields.forEach((item) => {
    const itemSpan = item.col || 24;
    if (currentSpan + itemSpan > 24) {
      rows.push([]);
      currentSpan = 0;
    }
    rows[rows.length - 1].push(item);
    currentSpan += itemSpan;
  });

  return rows;
});

// 组件映射
const componentMap: Record<string, Component> = {
  input: Input,
  inputPassword: Input.Password,
  select: Select,
  timePicker: TimePicker,
};

const getComponent = (item: FormField<T>): Component => {
  return item.type === "custom"
    ? item.component
    : componentMap[item.type] || Input;
};

// 表单操作
const formRef = ref<FormInstance>();

const handleSubmit = (values: K) => {
  props.formActions.onSubmit?.(values);
};

const handleButtonClick = (footer: FormFooter) => {
  switch (footer.type) {
    case "reset":
      formRef.value?.resetFields();
      props.formActions.onReset?.();
      break;
    default:
      footer.props?.onClick?.();
  }
};

// 暴露方法
defineExpose({
  validate: (nameList?: NamePath[]) => formRef.value?.validate(nameList),
  resetFields: () => formRef.value?.resetFields(),
});
</script>

<template>
  <a-form
    name="custom-validation"
    ref="formRef"
    :model="modelValue"
    @finish="handleSubmit"
  >
    <a-row
      v-for="(row, rowIndex) in groupedFields"
      :key="rowIndex"
      :gutter="16"
    >
      <a-col
        v-for="(item, colIndex) in row"
        :key="colIndex"
        :span="item.col || 24"
      >
        <a-form-item :label="item.label" :name="item.field" :rules="item.rules">
          <component
            :is="getComponent(item)"
            v-bind="item.props"
            v-model:value="modelValue[item.field]"
          >
            <!-- 动态插槽 -->
            <template v-for="(slotName, slotKey) in item.slots" #[slotKey]>
              <slot :name="slotName" />
            </template>
          </component>
        </a-form-item>
      </a-col>
    </a-row>

    <!-- 表单按钮 -->
    <a-form-item v-if="formFooter.length">
      <a-space>
        <template v-for="(btn, _index) in formFooter" :key="_index">
          <a-button
            v-bind="btn.props"
            :html-type="btn.type === 'submit' ? 'submit' : 'button'"
            @click="handleButtonClick(btn)"
          >
            {{ btn.content }}
          </a-button>
        </template>
      </a-space>
    </a-form-item>
  </a-form>
</template>
