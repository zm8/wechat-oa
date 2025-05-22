<!-- FormSimple.vue -->
<script setup lang="ts">
import { defineComponent, h, reactive, ref, toRaw } from "vue";
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { FormCustom } from "./FormCustom";
import type { FormField, FormProps, FormInstance } from "./FormCustom";
import { Input } from "ant-design-vue";

interface FormState {
  username: string;
  password: string;
  city: string;
  customContent: string;
}

type FormStateKey = keyof FormState;

const CustomComponent = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    return () =>
      h(Input, {
        value: props.modelValue,
        onInput: (e) => {
          emit("update:modelValue", e.target.value);
        },
      });
  },
});

const formRef = ref<FormInstance>();

const initState: FormState = {
  username: "David",
  password: "123456",
  city: "ShangHai",
  customContent: "hello",
};

const formState = reactive({ ...initState });

const resetFormState = () => {
  Object.assign(formState, { ...initState });
};

const formProps: FormProps<FormState> = {
  config: {
    onSubmit: (res) => {
      console.log("onSubmit:", res);
    },
    onReset: () => {
      resetFormState();
      console.log("onReset:", toRaw(formState));
    },
  },
  footer: [
    {
      type: "submit",
      content: "提交",
      props: {
        type: "primary",
      },
    },
    {
      type: "reset",
      content: "重置",
      props: {
        class: "ml-1",
      },
    },
  ],
};

const fields: FormField<FormStateKey>[] = [
  {
    type: "input",
    col: 12,
    props: { placeholder: "请输入用户名" },
    label: "用户名",
    field: "username",
    slots: { prefix: "input_prefix" },
    rules: [{ required: true, message: "用户名不能为空" }],
  },
  {
    type: "inputPassword",
    col: 12,
    props: { placeholder: "请输入密码" },
    label: "密码",
    field: "password",
    slots: { prefix: "inputPassword_prefix" },
    rules: [{ required: true, message: "密码不能为空" }],
  },
  {
    type: "custom",
    component: CustomComponent,
    props: { placeholder: "请输入内容" },
    label: "自定义组件",
    field: "customContent",
    rules: [{ required: true, message: "内容不能为空" }],
  },
  {
    type: "select",
    col: 12,
    props: {
      placeholder: "请输入城市",
      options: [
        { label: "北京", value: "BeiJing" },
        { label: "上海", value: "ShangHai" },
      ],
    },
    label: "选择城市",
    field: "city",
    rules: [{ required: true, message: "城市不能为空" }],
  },
];
</script>

<template>
  <FormCustom ref="formRef" v-model="formState" v-bind="{ fields, formProps }">
    <template #input_prefix>
      <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
    </template>
    <template #inputPassword_prefix>
      <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
    </template>
  </FormCustom>
</template>
