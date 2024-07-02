<!--用于扫码活动定制UI弹窗, 活动期间使用该组件自行调整样式即可--->
<template>
  <van-overlay :show="showPopup" :z-index="zIndex" :lock-scroll="lockScroll">
    <view class="mask">
      <view class="popup-box MP-Font flex border-box">
        <view class="content flex">
          <view v-if="title" class="title">{{ title }}</view>
          <view class="msg">{{ text }}</view>
        </view>
        <view class="big-btn flex-c-c" @click="onConfirm">
          {{ confirmText }}
        </view>
        <image
          class="close ab-x-c"
          mode="widthFix"
          src="../static/images/icon/close.png"
          @click="onCancel"
        />
      </view>
    </view>
  </van-overlay>
</template>

<script lang="ts" setup>
// import { useMainStore } from '@/stores/main';

defineProps({
  showPopup: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number,
    default: 100
  },
  title: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: ''
  },
  lockScroll: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['confirmEvent', 'cancelEvent']);

const onConfirm = () => {
  emit('confirmEvent');
};
const onCancel = () => {
  emit('cancelEvent');
};
</script>

<style lang="scss">
.mask {
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  .popup-box {
    position: relative;
    flex-direction: column;
    align-items: center;
    width: 740rpx;
    height: 600rpx;
    color: $theme;
    padding: 30rpx 30rpx 120rpx 20rpx;
    margin-left: 26rpx;
    background: url('https://img.carlsberg.cn/container-reference/scrm/2024-02-22/dd86398c1676438d8a56f3e129e87111.png')
      no-repeat left top/cover;
  }
  .close {
    width: 60rpx;
    bottom: -100rpx;
    padding: 10rpx;
    bottom: -90rpx;
  }
  .content {
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .title {
      font-size: 50rpx;
      text-align: center;
      margin-bottom: 50rpx;
    }
    .msg {
      font-size: 32rpx;
      color: #4d5c9a;
      text-align: center;
      line-height: 1.3;
    }
  }
  .btn-box {
    font-size: 34rpx;
    width: 100%;
    justify-content: center;

    .small-btn {
      height: 60rpx;
      padding: 0 36rpx;
      border-radius: 26rpx;
      background: linear-gradient(0deg, #c5d8ee 0%, #ffffff);
    }
    .confirm {
      border: 3rpx solid $theme;
    }
    .cancel {
      color: $text-color-grey;
      margin-right: 40rpx;
      border: 3rpx solid $text-color-grey;
    }
  }
  .big-btn {
    font-size: 32rpx;
    width: 452rpx;
    height: 98rpx;
    letter-spacing: 6rpx;
    color: $text-color-white;
    background: url('https://img.carlsberg.cn/container-reference/scrm/2024-02-27/cb27c6c7a0e34754bb4df212e97f3b52.png')
      no-repeat 0 0/100% 100%;
  }
}
</style>
