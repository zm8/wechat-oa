<!-- FormSimple.vue -->
<script setup lang="ts">
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { reactive, ref, toRaw } from "vue";
import type {
  FormField,
  FormFooter,
  FormConfig,
  FormInstance,
} from "./FormCustom";
import { FormCustom } from "./FormCustom";
import type { Rule } from "ant-design-vue/es/form";

type FormState = {
  username: string;
  password: string;
  confirmPassword: string;
};
type FormStateKey = keyof FormState;

const formRef = ref<FormInstance>();

const initState: FormState = {
  username: "David",
  password: "",
  confirmPassword: "",
};

const formState = reactive({ ...initState });

const resetFormState = () => {
  Object.assign(formState, { ...initState });
};

const formActions: FormConfig<FormState> = {
  onSubmit: (res) => {
    console.log("onSubmit:", res);
  },
  onReset: () => {
    resetFormState();
    console.log("onReset:", toRaw(formState));
  },
};

const formFooter: FormFooter[] = [
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
];

const validatePass = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("Please input the password");
  } else {
    if (formState.confirmPassword !== "") {
      formRef.value?.validate("confirmPassword");
    }
    return Promise.resolve();
  }
};
const validatePassConfirm = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("Please input the password again");
  } else if (value !== formState.password) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};

const fields: FormField<FormStateKey>[] = [
  {
    type: "input",
    props: { placeholder: "请输入用户名" },
    label: "用户名",
    field: "username",
    slots: { prefix: "input_prefix" },
    rules: [{ required: true, message: "用户名不能为空" }],
  },
  {
    type: "inputPassword",
    props: { placeholder: "请输入密码" },
    label: "密码",
    field: "password",
    slots: { prefix: "inputPassword_prefix" },
    rules: [{ required: true, validator: validatePass, trigger: "change" }],
  },
  {
    type: "inputPassword",
    props: { placeholder: "请输入确认密码" },
    label: "确认密码",
    field: "confirmPassword",
    slots: { prefix: "inputPassword_prefix" },
    rules: [
      { required: true, validator: validatePassConfirm, trigger: "change" },
    ],
  },
];
</script>

<template>
  <FormCustom
    ref="formRef"
    v-model="formState"
    v-bind="{ fields, formActions, formFooter }"
  >
    <template #input_prefix>
      <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
    </template>
    <template #inputPassword_prefix>
      <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
    </template>
  </FormCustom>
</template>
