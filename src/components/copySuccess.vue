<template>
  <van-popup :show="showCopySuccess" custom-style="background-color: transparent;" z-index="999">
    <view class="copy-module flex-c-c">
      <image
        class="img"
        src="https://img.carlsberg.cn/container-reference/azure-crm/2024-01-03/dfff97951ff447ee91b844aa0b0a06c0.png"
      />
      <view class="text MP-Font">{{ text }}</view>
    </view>
  </van-popup>
</template>
<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '复制成功'
  }
});

const showCopySuccess = ref(false);
let timeId: any;
const emit = defineEmits(['close']);

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      showCopySuccess.value = true;
      timeId = setTimeout(() => {
        clearTimeout(timeId);
        showCopySuccess.value = false;
        emit('close');
      }, 2000);
    }
  }
);
</script>
<style scoped lang="scss">
.copy-module {
  flex-direction: column;
  width: 640rpx;
  height: 420rpx;
  background: url('https://img.carlsberg.cn/container-reference/azure-crm/2024-01-02/4e911db7093b4628bfc2c62bb7977357.png')
    no-repeat 0 0/100% 100%;
  .img {
    width: 96rpx;
    height: 74rpx;
  }
  .text {
    font-size: 50rpx;
    margin-top: 40rpx;
    color: $theme;
  }
}
</style>
