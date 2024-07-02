<template>
  <view class="page-content">
    <video
      v-if="sourceObj?.sourceType === 1"
      :src="sourceObj.sourceUrl"
      object-fit="fill"
      :enable-progress-gesture="false"
      :autoplay="true"
      :show-fullscreen-btn="false"
      :controls="true"
      class="main"
      @ended="goIndex"
    ></video>

    <image
      v-if="sourceObj?.sourceType === 0"
      class="main"
      mode="scaleToFill"
      :src="sourceObj.sourceUrl"
      lazy-load="false"
      @click="clickLoading"
      @load="imgEndedHandle"
    />

    <view
      v-if="sourceObj?.sourceUrl"
      class="skip"
      :style="{ top: navHeight + 'px' }"
      @click="goIndex"
    >
      跳过
    </view>
  </view>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { Track } from '@/utils/track';
import { getLoadingInfo } from '@/service/api/main';
const useAfterToken = inject<any>('useAfterToken');

const store = useMainStore();
const navHeight = ref(store.navBarHeight);

let iTimer: any;

interface LoadingSourceType {
  id: number;
  sourceType: number; // 0: 图片, 1: 视频
  name?: string;
  sourceUrl?: string;
  jumpHref?: string;
  jumpType: number; // 3: 跳转小程序内部页面
}
const sourceObj = ref<LoadingSourceType>();

// 获取loading页数据
const queryLoadingData = async () => {
  try {
    const res = await getLoadingInfo();
    if (res.code === 0) {
      const { sourceUrl } = res?.data || {};
      if (sourceUrl) {
        sourceObj.value = res.data;
      } else {
        goIndex();
      }
    }
  } catch (error) {
    console.log('获取loading页数据----catch', error);
  }
};

onLoad(() => {
  useAfterToken(() => {
    queryLoadingData();
  });
});

const goIndex = () => {
  Track('Open screen', 'Click', 'Open screen_skip');
  uni.switchTab({
    url: '../index/index'
  });
};

const clickLoading = () => {
  const { jumpType, jumpHref } = sourceObj.value!;
  if (jumpType === 3 && jumpHref) {
    uni.redirectTo({
      url: jumpHref,
      success: () => {
        clearTimeout(iTimer);
      }
    });
  }
};

const imgEndedHandle = () => {
  iTimer = setTimeout(() => {
    goIndex();
    clearTimeout(iTimer);
  }, 1600);
};
</script>

<style lang="scss" scoped>
.page-content {
  position: relative;
  background-color: $light-theme;

  .main {
    width: 100%;
    height: 100%;
  }
  .skip {
    position: absolute;
    right: 30rpx;
    color: $text-color-white;
    font-size: $font-size-sm;
    border: 1px solid #fff;
    height: 30rpx;
    line-height: 30rpx;
    padding: 4px 10px;
    border-radius: 15px;
  }
}
</style>
