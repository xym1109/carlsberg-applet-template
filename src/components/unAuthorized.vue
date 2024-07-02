<template>
  <view class="page-content MP-Font">
    <view class="page-content MP-Font">
      <image class="left-icon" src="../../../static/images/icon/left_icon.png" @click="goBack" />
      <view class="auth-module flex-x-center">
        <image class="logo" mode="widthFix" src="../../static/images/logo2.png" />
        <view class="title">您还未登录，马上登录发现更多精彩！</view>
        <view class="medium-btn flex-c-c" @click="goAuth">点击登录</view>
      </view>
    </view>
    <authModule />
    <scanCodeModule />
  </view>
</template>
<script setup lang="ts">
import authModule from '@/components/authModule.vue';
import scanCodeModule from '@/components/scanCodeModule.vue';
import { authPhone } from '@/hooks/index';
import { Track } from '@/utils/track';

const emit = defineEmits(['authSuccess']);

// 去授权
const goAuth = () => {
  Track('Registration Transfer', 'Click', 'Registration Transfer_Click log in');
  authPhone(null, () => {
    emit('authSuccess');
  });
};

// 返回
const goBack = () => {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  });
};
</script>
<style scoped lang="scss">
.page-content {
  background: $bg-color-light
    url('https://img.carlsberg.cn/container-reference/scrm/2024-01-05/fe0dbd7a555642f88da024cc2f65cf30.jpg')
    no-repeat 0 0/100% 100%;
  .left-icon {
    position: absolute;
    left: 20rpx;
    top: 90rpx;
    width: 52rpx;
    height: 52rpx;
    padding: 10rpx;
  }
}
.auth-module {
  padding-top: 248rpx;
  flex-direction: column;
  .logo {
    width: 245rpx;
  }
  .title {
    font-size: 36rpx;
    color: $theme;
    margin-top: 110rpx;
  }
  .medium-btn {
    margin-top: 76rpx;
  }
}
</style>
