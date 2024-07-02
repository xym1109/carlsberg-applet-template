<template>
  <Container title="积分商城" :arrow-left="false">
    <view class="page-content MP-Font full-bg">积分商城</view>
  </Container>
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from '@/components/tabBar.vue';
onShow(() => {
  uni.hideTabBar();
});
</script>

<style scoped lang="scss"></style>
