<template>
  <!--扫码成功-->
  <!--   <Popup
    :show-popup="store.scanCodePopup"
    title="扫码成功"
    :text="'恭喜您获得' + scanCodeData.point + '积分'"
    @confirm-event="onScanCodeSuccess"
  /> -->
  <!--扫码失败-->
  <!--  <Popup
    :show-popup="store.scanCodeFailPopup"
    :title="scanCodeFailMsg.title"
    :text="scanCodeFailMsg.msg"
    :confirm-text="scanCodeFailMsg.errCode === 2049 ? '去反馈' : '确认'"
    :cancel-text="scanCodeFailMsg.errCode === 2049 ? '知道了' : ''"
    @confirm-event="closePopup"
    @cancel-event="closeFailPopup"
  /> -->

  <!--定制活动扫码成功UI--->
  <ActivityScanPopup
    :show-popup="store.scanCodePopup"
    title="扫码成功"
    :text="'恭喜您获得' + scanCodeData.point + '积分'"
    @confirm-event="onScanCodeSuccess"
    @cancel-event="closePopup"
  />
  <!--定制活动扫码失败UI--->
  <ActivityScanPopup
    :show-popup="store.scanCodeFailPopup"
    :title="scanCodeFailMsg.title"
    :text="scanCodeFailMsg.msg"
    :confirm-text="scanCodeFailMsg.errCode === 2049 ? '去反馈' : '确认'"
    @confirm-event="closePopup"
    @cancel-event="closeFailPopup"
  />

  <!---无地理位置弹窗-->
  <van-overlay :show="store.showNoLocationPopup" z-index="101">
    <view class="page-content flex-c-c">
      <view class="no-location-box">
        <view class="auth-btn MP-Font flex-c-c" @click="onSetting('showNoLocationPopup')">
          前往授权
        </view>
        <image
          class="close left-center"
          src="../static/images/icon/close.png"
          @click="closeGuidePopup('showNoLocationPopup')"
        />
      </view>
    </view>
  </van-overlay>

  <!-- UTC活动位置授权指引弹窗 -->
  <van-overlay :show="store.utcScanLocationGuide" z-index="101">
    <view class="page-content flex-c-c">
      <view class="location-guide MP-Font flex-c-c full-bg">
        <view class="main-title">开启位置授权</view>
        <view class="main-title">参与风花雪月春天活动</view>
        <view class="sub-title mtop30">*为了了解您是否在活动区域</view>
        <view class="sub-title">需要您开启位置授权才能正常参与</view>
        <view class="loca-btn flex-c-c full-bg bg452" @click="onSetting('utcScanLocationGuide')">
          点击开启
        </view>
        <image
          class="close-btn"
          src="../static/images/icon/close.png"
          @click="closeGuidePopup('utcScanLocationGuide')"
        />
      </view>
    </view>
  </van-overlay>

  <!-- 允许授权，重新扫码 -->
  <van-overlay :show="store.utcAllowReScanPopup" z-index="101">
    <view class="page-content flex-c-c">
      <view class="location-guide MP-Font flex-c-c full-bg">
        <view class="sub-title">位置信息授权成功</view>
        <view class="sub-title">请再次扫描该盖码参与活动</view>
        <view class="loca-btn flex-c-c full-bg mtop60" @click="goScan">
          <image class="icon" src="../static/images/icon/scan-icon.png" />
          开盖扫码
        </view>
        <image
          class="close-btn"
          src="../static/images/icon/close.png"
          @click="onClose('utcAllowReScanPopup')"
        />
      </view>
    </view>
  </van-overlay>

  <!--瓶身码活动规则弹窗-->
  <Popup
    :show-popup="store.showActivityRule"
    :use-slot="true"
    :lock-scroll="false"
    :show-logo="false"
  >
    <view class="bottle-body-rule">
      <view class="rule-title MP-Font">{{ store.bottleBodyRule.title }}</view>
      <view class="activity-rule MP-Font" v-html="store.bottleBodyRule.content" />
      <view class="rule-btn flex-c-c" @click="closePopup('rule')">确 认</view>
    </view>
  </Popup>
</template>

<script lang="ts" setup>
import Popup from './popup.vue';
import ActivityScanPopup from './activityScanPopup.vue';
import { useMainStore } from '@/stores/main';
import { useScanCode } from '@/hooks/useScanCode';
import { initLocation } from '@/hooks/index';
import { Track } from '@/utils/track';
import { throttle } from '@/utils/index';
import { clearLocation } from '@/service/api/main';

const store = useMainStore();
const { scanCodeHandle, bottleCapCodeHandle } = useScanCode();
const { scanCodeData, scanCodeFailMsg } = store;

const onScanCodeSuccess = () => {
  store.$patch({
    scanCodePopup: false
  });
};

// 扫码无经纬度，打开设置引导用户授权
const onSetting = (key: string) => {
  if (key === 'utcScanLocationGuide') {
    Track(
      'spring_activity_2024',
      'click',
      key === 'utcScanLocationGuide'
        ? 'location_authorization_open'
        : 'scan_success__unauthorizedopen_location'
    );
  } else {
    Track('Pop-ups', 'Click', 'Pop-ups_custom_position_empower');
  }
  uni.openSetting({
    async success(res: any) {
      const { authSetting } = res;
      const userLocation = authSetting['scope.userLocation'];
      console.log('是否授权了:', userLocation);
      store.$patch({
        [key]: false
      });
      // 允许授权，更新地理位置并调用code接口
      if (userLocation) {
        initLocation(() => {
          if (key === 'showNoLocationPopup') {
            uni.showModal({
              content: '地理位置信息授权成功，请重新扫瓶盖码',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#293a7f',
              success: (result: any) => {
                result.confirm && scanCodeHandle();
              }
            });
          } else if (key === 'utcScanLocationGuide') {
            Track('spring_activity_2024', 'pop', 'location_authorize_success_window');
            store.$patch({
              utcAllowReScanPopup: true
            });
          }
        });
      } else {
        // 拒绝授权，清除后端缓存的位置信息
        await clearLocation();
        if (key === 'utcScanLocationGuide') {
          rejectOperation();
        }
      }
    },
    fail(err) {
      console.log('error', err);
    }
  });
};

// 拒绝后调扫码接口获取10积分奖励
const rejectOperation = () => {
  const { code, subdomain } = store.saveCodeInfo;
  bottleCapCodeHandle(code, subdomain);
  store.$patch({
    saveCodeInfo: {
      code: '',
      subdomain: ''
    }
  });
};

// 点击叉叉按钮，关闭授权指引弹窗 => 也是送积分
const closeGuidePopup = async (keywords: string) => {
  // 拒绝授权，清除后端缓存的位置信息
  await clearLocation();
  onClose(keywords);
  rejectOperation();
};

// 去扫码
const goScan = throttle(() => {
  Track('spring_activity_2024', 'click', 'location_authorize_success_scan');
  scanCodeHandle();
  store.$patch({
    utcAllowReScanPopup: false
  });
});

const closePopup = (type?: string) => {
  // 扫码失败去反馈
  if (store.scanCodeFailMsg.errCode === 2049) {
    uni.navigateTo({
      url: '/subpackages/personalCenter/problemsAndSuggestions/index'
    });
  } else {
    type === 'location' && Track('Pop-ups', 'Click', 'Pop-ups_custom_position_close');
  }
  store.$patch({
    scanCodeFailMsg: {
      errCode: 0,
      title: '',
      msg: ''
    },
    scanCodeFailPopup: false,
    showNoLocationPopup: false,
    showActivityRule: false,
    scanCodePopup: false
  });
};
const closeFailPopup = () => {
  store.$patch({
    scanCodeFailPopup: false
  });
};

// 关闭弹窗
const onClose = (key: string) => {
  store.$patch({
    [key]: false
  });
};
</script>

<style lang="scss" scoped>
.scan-code-box {
  position: relative;
  flex-direction: column;
  width: 690rpx;
  min-height: 520rpx;
  padding: 80rpx 0 50rpx;
  border-radius: 16rpx;
  align-items: center;
  justify-content: space-around;
  background-color: $bg-color;
  .close-icon {
    position: absolute;
    top: 20rpx;
    right: 30rpx;
  }
  .msg {
    width: 86%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40rpx;
    .msg-title {
      font-size: 38rpx;
      font-weight: 600;
      text-align: center;
    }
    .msg-tips {
      margin-top: 40rpx;
    }
    .top-margin {
      margin-top: 30rpx;
    }
  }
  .btn {
    width: 310rpx;
    height: 84rpx;
    line-height: 84rpx;
    text-align: center;
    border-radius: 8rpx;
    color: $text-color-white;
    background-color: $theme;
  }
  .footer-btn {
    width: 100%;
    justify-content: space-around;
    .btn2 {
      width: 304rpx;
      height: 80rpx;
      color: $theme;
      border: 2rpx solid $theme;
      background: $bg-color;
    }
  }
}
.no-location-box {
  position: relative;
  width: 640rpx;
  height: 1100rpx;
  background: #61a8ee
    url('https://img.carlsberg.cn/container-reference/azure-crm/2024-01-06/058cf7fca7b94036afa5604aa070f0b4.png')
    no-repeat 0 0/100% 100%;
  .auth-btn {
    font-size: 38rpx;
    width: 400rpx;
    height: 92rpx;
    color: $theme;
    border-radius: 45rpx;
    border: 3rpx solid $theme;
    margin: 940rpx auto 0;
    background: linear-gradient(0deg, #c5d8ee 0%, #ffffff);
  }
  .close {
    position: absolute;
    width: 56rpx;
    height: 56rpx;
    bottom: -90rpx;
    left: 290rpx;
    &.left-center {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.bottle-body-rule {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: -80rpx;

  .rule-title {
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 30rpx;
  }
  .activity-rule {
    font-size: 25rpx;
    width: 90%;
    height: 660rpx;
    overflow-y: scroll;
  }
  .rule-btn {
    width: 260rpx;
    height: 70rpx;
    margin-top: 40rpx;
    border-radius: 36rpx;
    border: 2rpx solid $theme;
    background: linear-gradient(0deg, #c5d8ee 0%, #ffffff);
  }
}
.location-guide {
  position: relative;
  width: 740rpx;
  height: 600rpx;
  color: $theme;
  margin-left: 18rpx;
  box-sizing: border-box;
  flex-direction: column;
  background-image: url('https://img.carlsberg.cn/container-reference/scrm/2024-02-22/dd86398c1676438d8a56f3e129e87111.png');
}
.main-title {
  font-size: 50rpx;
  line-height: 54rpx;
}
.sub-title {
  font-size: 28rpx;
  line-height: 40rpx;
}
.desc {
  font-size: 21rpx;
  line-height: 24rpx;
  margin: 50rpx 0 10rpx;
}
.loca-btn {
  width: 284rpx;
  height: 98rpx;
  font-size: 38rpx;
  color: $text-color-white;
  background-image: url('https://img.carlsberg.cn/container-reference/scrm/2024-02-27/92588e3d44424b878b7344da6f69a922.png');
  margin-top: 28rpx;
  &.bg452 {
    width: 452rpx;
    background-image: url('https://img.carlsberg.cn/container-reference/scrm/2024-02-27/cb27c6c7a0e34754bb4df212e97f3b52.png');
  }
  &.cancel {
    margin-right: 44rpx;
    background-image: url('https://img.carlsberg.cn/container-reference/scrm/2024-02-27/c4da2ee62d0d4ee8b46386b75b6bed0c.png');
  }
  .icon {
    width: 31rpx;
    height: 31rpx;
    margin-right: 14rpx;
  }
}
.mtop30 {
  margin-top: 30rpx;
}
.mtop40 {
  margin-top: 40rpx;
}
.mtop60 {
  margin-top: 60rpx;
}
.close-btn {
  position: absolute;
  right: 350rpx;
  bottom: -80rpx;
  width: 56rpx;
  height: 56rpx;
}
</style>
