<template>
  <view class="page-content">
    <web-view :src="url" />
  </view>
</template>

<script setup lang="ts">
const url = ref('');

onLoad((option) => {
  if (option) {
    url.value = option.url;
  }
});
</script>

<style scoped lang="scss">
.page-content {
  height: 100%;
}
</style>
