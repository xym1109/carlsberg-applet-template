<template>
  <view class="nav-bar-box">
    <view v-if="isHome" class="flex nav-bar home-nav-bar" :style="{ height: navBarHeight + 'px' }">
      <image class="logo-font" src="../static/images/logo_font.png" />
    </view>

    <view v-else class="flex nav-bar" :style="{ height: navBarHeight + 'px' }">
      <template v-if="isCustomBack">
        <image
          v-if="arrowLeft"
          class="left-icon"
          src="../static/images/icon/left_icon.png"
          @click="onCustomBack"
        />
      </template>
      <template v-else>
        <image
          v-if="arrowLeft"
          class="left-icon"
          src="../static/images/icon/left_icon.png"
          @click="goBack"
        />
      </template>
      <text class="MP-Font text" :class="[arrowLeft ? '' : 'spacing']">
        {{ title }}
      </text>
    </view>
  </view>
  <view
    class="container"
    :style="{
      top: store.navBarHeight + 'px',
      height: customHeight ? '' : 'calc(100% - ' + store.navBarHeight + 'px)'
    }"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores/main';
const store = useMainStore();

defineProps({
  isHome: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '风华雪月'
  },
  // 是否显示返回按钮icon
  arrowLeft: {
    type: Boolean,
    default: true
  },
  // 是否自定义返回按钮
  isCustomBack: {
    type: Boolean,
    default: false
  },
  customHeight: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['customBack']);

const statusBarHeight = +store.systemInfo.statusBarHeight;
const navBarHeight = ref(statusBarHeight + 45);

// 自定义返回
const onCustomBack = () => {
  emit('customBack');
};

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

<style lang="scss">
.nav-bar-box {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f2f2f2;
  .nav-bar {
    align-items: flex-end;
    box-sizing: border-box;
    padding: 0 50px 10px 12px;
    .text {
      font-size: $font-size-lg;
      margin: 0 auto;
      color: $text-color;
      font-weight: 600;
    }
    .left-icon {
      width: 52rpx;
      height: 52rpx;
    }
    .spacing {
      padding-left: 25px;
    }
  }
  .home-nav-bar {
    justify-content: center;
    padding: 0;
    background: url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-19/eb2d681f96c7486ca9ff9d06f896695b.png')
      no-repeat 0 0/100% 100%;
    .logo-font {
      width: 233rpx;
      height: 77rpx;
    }
  }
}
.container {
  position: relative;
  left: 0;
  width: 100%;
  bottom: 0;
}
.container::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
