const fn = () => {
  console.log(`Hello World`);
};
console.log(fn.length);
fn();

const asyncFn = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 1000);
  });
};

asyncFn().then((res) => {
  console.log(res);
});
