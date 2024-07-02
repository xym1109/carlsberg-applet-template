<template>
  <Container :is-home="true" :custom-height="true">
    <view class="page-content MP-Font">首页</view>
  </Container>
  <TabBar />
  <authModule />
  <scanCodeModule />
</template>

<script setup lang="ts">
import TabBar from '@/components/tabBar.vue';
import authModule from '@/components/authModule.vue';
import scanCodeModule from '@/components/scanCodeModule.vue';
import { useMainStore } from '@/stores/main';

const store = useMainStore();

onShow(() => {
  store.$patch({
    activityTab: 1
  });
  uni.hideTabBar();
});
</script>

<style scoped lang="scss">
.page-content {
  height: 100%;
  background: #ecf6fe
    url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-19/444504516c8c4fd99291da2c69cc39b1.png')
    no-repeat 0 0/100% 100%;
}
</style>
