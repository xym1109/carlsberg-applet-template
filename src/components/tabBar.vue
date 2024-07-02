<template>
  <view class="tab-bar-box">
    <view class="tab-bar">
      <view v-for="item in tabBar.list" :key="item.id">
        <view :class="['tab-list', 'flex', 'tab-list' + item.id]" @click="switchTabBar(item)">
          <image
            :class="['icon', 'icon' + item.id]"
            :src="store.activityTab === item.id ? item.selectedIconPath : item.iconPath"
          />
        </view>
      </view>
    </view>
    <view class="safe-distance" />
  </view>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { authPhone } from '@/hooks/index';
import { useScanCode } from '@/hooks/useScanCode';
import { Track } from '@/utils/track';

const store = useMainStore();
const activityTab = ref(store.activityTab);
const { scanCodeHandle } = useScanCode();
const tabBar = reactive({
  list: [
    {
      id: 1,
      track: 'Navigation_Home',
      pagePath: '/pages/index/index',
      iconPath: '../static/images/tabBar/index.png',
      selectedIconPath: '../static/images/tabBar/index_active.png'
    },
    {
      id: 2,
      track: 'Navigation_Activity',
      pagePath: '/pages/brandActivity/brandActivity',
      iconPath: '../static/images/tabBar/brandActivities.png',
      selectedIconPath: '../static/images/tabBar/brandActivities_active.png'
    },
    {
      id: 3,
      track: 'Navigation_Scan',
      pagePath: '',
      iconPath: '',
      selectedIconPath: ''
    },
    {
      id: 4,
      track: 'Navigation_Points Mall',
      pagePath: '/pages/mall/mall',
      iconPath: '../static/images/tabBar/pointsMall.png',
      selectedIconPath: '../static/images/tabBar/pointsMall_active.png'
    },
    {
      id: 5,
      track: 'Navigation_My',
      pagePath: '/pages/my/my',
      iconPath: '../static/images/tabBar/my.png',
      selectedIconPath: '../static/images/tabBar/my_active.png'
    }
  ]
});

const switchTabBar = (item: any) => {
  activityTab.value = item.id;
  store.$patch({
    activityTab: item.id
  });
  Track('Navigation', 'Click', `${item.track}`);
  if (activityTab.value === 3) {
    authPhone(null, () => {
      scanCodeHandle();
    });
  } else {
    uni.switchTab({
      url: item.pagePath
    });
  }
};
</script>

<style scoped lang="scss">
.tab-bar-box {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  .tab-bar {
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    text-align: center;
    width: 100%;
    height: 237rpx;
    padding-top: 130rpx;
    box-sizing: border-box;
    background: url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-18/985d84f15f424f22934afb95550dd276.png')
      no-repeat 0 0/100% 100%;
    .tab-list {
      justify-content: center;
    }
    .tab-list3 {
      position: relative;
      height: 166rpx;
      bottom: 66rpx;
    }
    .icon,
    .icon5 {
      width: 48rpx;
      height: 79rpx;
    }
    .icon2,
    .icon4 {
      width: 96rpx;
      height: 79rpx;
    }
  }
  .safe-distance {
    width: 100%;
    height: 30rpx;
    background-color: #b2ceeb;
  }
}
</style>
