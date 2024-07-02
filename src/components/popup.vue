<template>
  <van-overlay :show="showPopup" :z-index="zIndex" :lock-scroll="lockScroll">
    <view class="mask">
      <view class="popup-box MP-Font flex border-box">
        <image v-if="showLogo" class="logo" src="../static/images/logo.png" />
        <!--使用slot 自定义弹窗内容和操作按钮--->
        <slot v-if="useSlot"></slot>
        <template v-else>
          <view class="content flex">
            <view v-if="title" class="title">{{ title }}</view>
            <view class="msg">{{ text }}</view>
          </view>
          <!--存在确定和取消按钮时，显示两个按钮-->
          <view v-if="confirmText && cancelText" class="btn-box flex">
            <view class="small-btn cancel flex-c-c" @click="onCancel">{{ cancelText }}</view>
            <view class="small-btn confirm flex-c-c" @click="onConfirm">{{ confirmText }}</view>
          </view>
          <!--只有确认按钮-->
          <view v-else class="medium-btn flex-c-c full-bg" @click="onConfirm">
            {{ confirmText }}
          </view>
        </template>

        <image
          v-if="showClose"
          class="close ab-x-c"
          mode="widthFix"
          src="../static/images/close-btn.png"
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
  showLogo: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  useSlot: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: false
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
    width: 640rpx;
    color: $theme;
    padding: 180rpx 20rpx 80rpx;
    min-height: 530rpx;
    border-radius: 12rpx;
    background: #61a8ee
      url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-21/1c515951acc24f54b05429b9082817c0.png')
      no-repeat left top/cover;
  }
  .logo {
    position: absolute;
    width: 202rpx;
    height: 202rpx;
    top: -70rpx;
    left: 216rpx;
  }
  .close {
    width: 70rpx;
    bottom: -120rpx;
    padding: 10rpx;
  }
  .content {
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 50rpx;
    .title {
      font-size: 48rpx;
      margin-bottom: 28rpx;
    }
    .msg {
      font-size: 30rpx;
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
}
</style>
