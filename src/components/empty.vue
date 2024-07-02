<template>
  <view class="empty-module flex-c-c">
    <image
      class="img"
      src="https://img.carlsberg.cn/container-reference/scrm/2024-01-09/b66e5915337e468ca19c1c5d4454666e.png"
    />
    <view class="text MP-Font">{{ text }}</view>
  </view>
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
});
</script>
<style scoped lang="scss">
.empty-module {
  max-width: 700rpx;
  min-height: 500rpx;
  background-color: $bg-color;
  flex-direction: column;
  margin: 0 auto;
  box-sizing: border-box;
  .img {
    width: 271rpx;
    height: 250rpx;
  }
  .text {
    font-size: 32rpx;
    margin-top: 60rpx;
    color: $text-color-grey;
  }
}
</style>
