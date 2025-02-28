import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  variants: [
    (matcher) => {
      if (matcher.startsWith("5k:")) {
        return {
          matcher: matcher.slice(3),
          parent: "@media (aspect-ratio: 24/9)",
        };
      }
    },
  ],
  shortcuts: {
    "flex-center": "flex justify-center items-center",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center",
    "flex-x-between": "flex items-center justify-between",
    "flex-x-end": "flex items-center justify-end",
    "wh-full": "w-full h-full",
    "text-truncate": "whitespace-nowrap overflow-hidden text-ellipsis",
    "bg-no-repeat-contain": "bg-no-repeat bg-contain",
    "bg-no-repeat-cover": "bg-no-repeat bg-cover",
    "abs-full": "absolute left-0 right-0 top-0 bottom-0",
    "abs-x-center": "absolute left-50% top-0 translate-x--1/2",
    "abs-y-center": "absolute left-0 top-50% translate-y--1/2",
    "abs-center": "absolute left-50% top-50% translate-x--1/2 translate-y--1/2",
  },
  rules: [
    ["flex-row-reverse", { "flex-direction": "row-reverse" }],
    [
      /^transform-(\d+)-(.+)$/,
      ([, duration, timingFunction]) => ({
        transition: `transform ${duration}s ${timingFunction}`,
      }),
    ],
    [
      /^wh-(\d+)$/,
      ([, wh]) => ({
        width: `${wh}px`,
        height: `${wh}px`,
      }),
    ],
    [
      /^absolute-([lrtb]{1,4})-(\d+)$/,
      ([, directions, dis]) => {
        const styles = {
          position: "absolute",
        };
        const obj = {
          l: "left",
          r: "right",
          t: "top",
          b: "bottom",
        };
        for (const key in obj) {
          if (directions.includes(key)) {
            styles[obj[key]] = dis + "px";
          }
        }
        return styles;
      },
    ],
    [
      /^bg-rgba\((\d+),(\d+),(\d+),([0,1]?\.?\d*)\)$/,
      ([, r, g, b, a]) => ({
        "background-color": `rgba(${r},${g},${b},${a})`,
      }),
    ],
    [
      /^(b|outline)(t|r|b|l)?-(\d+)_(solid|dashed|dotted)_(#[0-9a-fA-F]{3,6}|rgba\((\d+),(\d+),(\d+),([0,1]?\.?\d*)\)|\w+)$/,
      ([, type, dir = "", width, style, color]) => {
        const bType = {
          b: "border",
          outline: "outline",
        };
        const dirObj = {
          t: "-top",
          r: "-right",
          b: "-bottom",
          l: "-left",
          "": "",
        };
        return {
          [`${bType[type]}${dirObj[dir]}`]: `${width}px ${style} ${color}`,
        };
      },
    ],
    [
      /^bg(?:-([a-z]+-[a-z]+|repeat))?(?:-(\d+%?_\d+%?|[a-z]+_[a-z]+))?(?:-(\d+%?_\d+%?|[a-z]+))?\[(.*)\]$/,
      ([, repeat = "no-repeat", pos = "left_top", size = "contain", url]) => {
        return {
          background: `url(${url}) ${repeat} ${pos.replace(
            "_",
            " "
          )} / ${size.replace("_", " ")}`,
        };
      },
    ],
    [
      /^([pm])-(\d+)(?:_(\d+))(?:_(\d+))?(?:_(\d+))?(?:_(\d+))?$/,
      ([, type, top, right, bottom, left]) => {
        const pm = type === "p" ? "padding" : "margin";
        const sides = [top, right, bottom, left]
          .filter(Boolean)
          .map((item) => item + "px")
          .join(" ");
        return {
          [pm]: sides,
        };
      },
    ],
  ],
  presets: [
    presetRemToPx({
      baseFontSize: 4,
    }),
    presetUno(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
