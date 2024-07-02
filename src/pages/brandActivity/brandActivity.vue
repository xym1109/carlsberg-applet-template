<template>
  <Container title="品牌活动" :arrow-left="false">
    <view class="page-content MP-Font full-bg">品牌活动</view>
  </Container>
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from '@/components/tabBar.vue';
import { useMainStore } from '@/stores/main';

const store = useMainStore();

onShow(() => {
  store.$patch({
    activityTab: 2
  });
  uni.hideTabBar();
});
</script>

<style scoped lang="scss">
.page-content {
}
</style>
