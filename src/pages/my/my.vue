<!-- eslint-disable vue/html-self-closing -->
<template>
  <Container title="积分商城" :arrow-left="false">
    <view class="page-content MP-Font full-bg">积分商城</view>
  </Container>
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from '@/components/tabBar.vue';
import { useMainStore } from '@/stores/main';

const store = useMainStore();

onShow(() => {
  store.$patch({
    activityTab: 5
  });
  uni.hideTabBar();
});
</script>

<style scoped lang="scss">
.page-content {
  padding: 0 20rpx;
  background: $bg-color-light
    url('https://img.carlsberg.cn/container-reference/scrm/2023-12-29/732ddad7d4154d508c14d83f4218264b.png')
    no-repeat 0 0/100% 100%;
}
</style>
