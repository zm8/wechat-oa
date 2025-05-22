import type { Component } from "vue";
import type { Rule, FormInstance } from "ant-design-vue/es/form";

type BaseField<T extends string, F extends string> = {
  type: T;
  label?: string;
  field: F;
  col?: number;
  props?: { placeholder: string };
  slots?: Record<string, string>;
  rules?: Rule[];
};

type Input<F extends string> = BaseField<"input", F>;

type InputPassword<F extends string> = BaseField<"inputPassword", F>;

type Select<F extends string> = BaseField<"select", F> & {
  props?: {
    options?: { label: string; value: string }[];
  };
};

type TimePicker<F extends string> = BaseField<"timePicker", F>;

type Custom<F extends string> = BaseField<"custom", F> & {
  component: Component;
};

export type FormField<F extends string> =
  | Input<F>
  | InputPassword<F>
  | Select<F>
  | TimePicker<F>
  | Custom<F>;

export type FormFooter = {
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
