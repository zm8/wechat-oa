import type { Component } from "vue";
import type { Rule, FormInstance } from "ant-design-vue/es/form";

type BaseFormItem<T extends string, F extends string> = {
  type: T;
  label?: string;
  field: F;
  col?: number;
  props?: { placeholder: string };
  slots?: Record<string, string>;
  rules?: Rule[];
};

type InputItem<F extends string> = BaseFormItem<"input", F>;
type InputPassword<F extends string> = BaseFormItem<"inputPassword", F>;
type SelectItem<F extends string> = BaseFormItem<"select", F> & {
  props?: {
    options?: { label: string; value: string }[];
  };
};
type TimePickerItem<F extends string> = BaseFormItem<"timePicker", F>;

export type CustomItem<F extends string> = BaseFormItem<"custom", F> & {
  component: Component;
};

export type FormItem<F extends string> =
  | InputItem<F>
  | InputPassword<F>
  | SelectItem<F>
  | TimePickerItem<F>
  | CustomItem<F>;

export type FooterButton = {
  type?: string;
  content: string;
  props?: {
    type?: string;
    class?: string;
    onClick?: () => void;
  };
};

export type FormConfig<T> = {
  onSubmit?: (values: T) => void;
  onReset?: () => void;
};

export { type FormInstance };
