export default {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 192, // 设计稿的宽度是 1920
      propList: ["*"],
      minPixelValue: 2, // 忽略 1px 转换 rem
    },
  },
};
