<template>
  <div class="card"></div>
</template>

<style scoped>
.card {
  width: 200px;
  height: 200px;
  margin: 20px auto;

  background-image: linear-gradient(
    90deg,
    rgba(8, 37, 183, 0.5),
    rgba(1, 180, 255, 0.1)
  );
}

[data-theme="dark"] .card {
  background-image: linear-gradient(
    90deg,
    rgba(64, 92, 233, 0.2),
    rgba(225, 43, 15, 1)
  );
}
</style>
