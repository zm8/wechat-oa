export default {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      minPixelValue: 2,
    },
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
