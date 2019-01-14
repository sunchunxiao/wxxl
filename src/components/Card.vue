<template>
  <div class="card">
    <slot />
  </div>
</template>

<script>
export default {
    name: "Card"
};
</script>

<style lang="scss" scoped>
.card {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #fff;
    border-radius: 5px;
    background: #fff;
    padding: 20px;
}
</style>
