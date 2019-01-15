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
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
}
</style>
