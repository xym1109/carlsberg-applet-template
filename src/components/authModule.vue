<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable prettier/prettier -->
<template>
  <!---手机号授权-->
  <van-overlay :show="store.authPhonePopup" z-index="100">
    <view class="page-content flex-c-c">
      <view class="content-box full-bg border-box MP-Font flex">
        <image class="auth-icon" src="../static/images/auth-icon.png" />
        <view class="default-text"> 请确认您已满18岁 </view>
        <view class="default-text"> 未满18岁不得饮酒不得参与此活动 </view>
        <image class="tips-icon" src="../static/images/auth-tips.png" />
        <view class="default-text"> 风花雪月小程序将获得您的手机号 </view>

        <view class="agree-text flex">
          <view class="select" @click="onSelectAgree">
            <image v-if="isAgree" src="../static/images/icon/select_icon.png" class="select-icon" />
          </view>
          我已阅读并同意
        </view>
        <view class="default-text" @click="goRuleDetail('WFSM')">
          《风花雪月小程序会员活动规则》
        </view>
        <view class="default-text" @click="goRuleDetail('privacyPolicy')">
          《风花雪月个人信息保护政策》
        </view>
        <view class="footer flex">
          <view class="btn" @click="closeAuthPhone" />
          <button
            v-if="isAgree"
            class="btn phone-btn"
            hover-class="none"
            open-type="getPhoneNumber"
            @click="phoneNumberTack"
            @getphonenumber="getPhoneNumber"
          >
          </button>
          <button v-else class="btn phone-btn" hover-class="none" @click="phoneNumberTack">
          </button>
        </view>
      </view>
    </view>
  </van-overlay>
  <!--授权注册成功弹窗-->
  <Popup
    :show-popup="store.authSuccessPopup"
    v-bind="authSuccessInfo"
    @confirm-event="onAuthSuccess"
  />
  <!--隐私协议授权--->
  <van-overlay :show="store.privacyPopup" z-index="1001">
    <view class="privacy-box MP-Font">
      <view class="title">风花雪月小程序隐私政策</view>
      <view class="msg msg1">亲爱的用户，感谢您使用风花雪月微信小程序</view>
      <view class="msg">
        为了更好的保护您的个人隐私及合法权益，我们依据相关法律制定/更新了
        <text class="text" @click="goRuleDetail('privacyPolicy')">
          《风花雪月小程序个人信息保护政策》
        </text>
        和
        <text class="text" @click="goRuleDetail('WFSM')"> 《风花雪月小程序用户协议》 </text>
        我们将基于合法、正当和必须等原则按照政策为您提供服务。请仔细阅读并充分理解
        <text class="text" @click="goRuleDetail('privacyPolicy')">
          《风花雪月小程序个人信息保护政策》
        </text>
        和
        <text class="text" @click="goRuleDetail('WFSM')">《风花雪月小程序用户协议》</text>
        的相关条款。如果您知悉并同意，点击“同意”开始接受我们的产品服务。
      </view>
      <button
        class="flex-c-c full-bg agree-btn"
        hover-class="none"
        open-type="agreePrivacyAuthorization"
        @agreeprivacyauthorization="confirmPrivacyHandle"
      >
        同意并继续
      </button>
      <view class="no-agree-btn" @click="disagreePrivacy">不同意</view>
    </view>
  </van-overlay>
  <!--隐私协议二次弹窗--->
  <van-overlay :show="store.aginPrivacyPopup" z-index="1001">
    <view class="page-content flex-c-c">
      <view class="privacy-agin MP-Font border-box flex-c-c">
        <image src="../static/images/logo2.png" class="logo2" />
        <view class="title">温馨提示</view>
        <view class="msg border-box">
          感谢您的支持与关注，我们深知个人信息对您的重要性，我们将按相关法律法规要求，尽力保护您的个人信息安全可控。在使用“扫码享礼”小程序前，请您同意
          <text class="text" @click="goRuleDetail('privacyPolicy')">
            《风花雪月小程序个人信息保护政策》
          </text>
          ，如您不同意，很遗憾我们无法继续提供服务。
        </view>
        <button
          class="agree-btn2 flex-c-c full-bg"
          open-type="agreePrivacyAuthorization"
          hover-class="none"
          @agreeprivacyauthorization="confirmPrivacyHandle('agin')"
        >
          同意并继续
        </button>
        <view class="no-agree-btn" @click="onExit">不同意并退出</view>
      </view>
    </view>
  </van-overlay>
</template>

<script lang="ts" setup>
import Popup from './popup.vue';
import { Track } from '@/utils/track';
import { bindPhone, totalPoint } from '@/service/api/main';
import { useMainStore } from '@/stores/main';
import { getUserInfo } from '@/hooks/authorization';
import { initLocation } from '@/hooks/index';

const store = useMainStore();
const authSuccessInfo = {
  title: '欢迎来到风花雪月',
  text: '恭喜您加入获得100积分',
  confirmText: '马上加入'
};
const isAgree = ref(false);

// 手机授权之前先确认是否勾选规则
const phoneNumberTack = () => {
  Track('Pop-ups', 'Click', 'Pop-ups_custom_18yearsOld');
  if (!isAgree.value) {
    uni.showToast({
      title: '请先勾选我已阅读并同意！',
      icon: 'none'
    });
    return false;
  }
};
// 授权手机号
const getPhoneNumber = async (e: any) => {
  const { encryptedData, iv, errMsg } = e.detail;
  if (errMsg === 'getPhoneNumber:ok') {
    Track('Pop-ups', 'Click', 'Pop-ups_WeChat_phone_allow');
    const { inviterId, activityCode } = store;
    let res: any = await bindPhone({
      iv,
      encryptedData,
      inviterId: inviterId && ['SHARE', 'SpringUtc'].includes(activityCode) ? inviterId : ''
    });
    if (res.code == 0) {
      store.setPhoneNumber(res.data?.phone);
      getUserInfo({});
      getTotalPoint();
      store.$patch({
        authSuccessPopup: true
      });
    } else {
      uni.showToast({
        title: res.msg,
        icon: 'error'
      });
    }
    store.$patch({
      authPhonePopup: false,
      needAuthPhoneAndLocation: false
    });
  } else {
    // 拒绝手机号授权
    closeAuthPhone();
    Track('Pop-ups', 'Click', 'Pop-ups_WeChat_phone_not allow');
  }
};

// 授权手机号成功【马上加入】
const onAuthSuccess = () => {
  Track('Pop-ups', 'Click', 'Pop-ups_custom_login successful_Join now');
  const { needAuthPhoneAndLocation } = store;
  store.$patch({
    authSuccessPopup: false
  });
  if (needAuthPhoneAndLocation) {
    initLocation(() => {
      uni.$emit('phoneAuthorized');
    });
  } else {
    uni.$emit('phoneAuthorized');
  }
};

// 勾选规则
const onSelectAgree = () => {
  Track('Pop-ups', 'Click', 'Pop-ups_custom_Rules&Privacy');
  isAgree.value = !isAgree.value;
};

// 获取积分总额
const getTotalPoint = async () => {
  let pointData: any = await totalPoint({});
  store.$patch({
    userTotalPoints: pointData.data?.total || 0
  });
};

// 拒绝授权
const closeAuthPhone = () => {
  // Track('Pop-ups', 'Click', 'Pop-ups_custom_phone_cancel');
  Track('Pop-ups', 'Click', 'Pop-ups_custom_under18');
  store.$patch({
    authPhonePopup: false
  });
};

// 同意隐私协议
const confirmPrivacyHandle = (type?: string) => {
  const label = type === 'agin' ? 'Pop-ups_Privacy_tip_agree' : 'Pop-ups_Privacy_agree';
  Track('Pop-ups', 'Click', label);
  uni.$emit('privacyEvent');
  store.$patch({
    privacyPopup: false,
    aginPrivacyPopup: false,
    needAuthPrivacy: false
  });
};

// 第一次不同意授权隐私
const disagreePrivacy = () => {
  Track('Pop-ups', 'Click', 'Pop-ups_Privacy_disagree');
  store.$patch({
    privacyPopup: false,
    aginPrivacyPopup: true
  });
};

const goRuleDetail = (code: string) => {
  uni.navigateTo({
    url: `/subpackages/personalCenter/activityRules/ruleDetails?code=${code}`
  });
};

// 再次不同意授权隐私，退出小程序
const onExit = () => {
  Track('Pop-ups', 'Click', 'Pop-ups_Privacy_tip_disagree');
  store.$patch({
    aginPrivacyPopup: false
  });
  wx.exitMiniProgram();
};
</script>

<style lang="scss" scoped>
.content-box {
  width: 735rpx;
  height: 1078rpx;
  flex-direction: column;
  align-items: center;
  color: $theme;
  border-radius: $border-radius-base;
  background-image: url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-22/051c7dfc8d4144d1b05e22bd5da3993f.png');
  .auth-icon {
    width: 131rpx;
    height: 116rpx;
    margin: 200rpx auto 160rpx;
  }
  .tips-icon {
    width: 95rpx;
    height: 113rpx;
  }
  .default-text {
    font-size: $font-size-lg;
    text-align: center;
    line-height: 1.6;
  }
  .agree-text {
    font-size: 24rpx;
    height: 70rpx;
    align-items: center;
    .select {
      position: relative;
      width: 25rpx;
      height: 25rpx;
      border: 1rpx solid #293a7f;
      border-radius: 6rpx;
      margin-right: 10rpx;
      .select-icon {
        position: absolute;
        width: 28rpx;
        height: 30rpx;
        top: -2rpx;
        left: -2rpx;
      }
    }
  }
  .footer {
    width: 640rpx;
    height: 106rpx;
    margin-top: 60rpx;
    .btn {
      width: 50%;
    }
  }
}
.privacy-box {
  position: fixed;
  bottom: 0;
  line-height: 1.6;
  width: 100%;
  height: 865rpx;
  color: $text-color;
  padding: 56rpx;
  box-sizing: border-box;
  border-top-right-radius: 26rpx;
  border-top-left-radius: 26rpx;
  background: #dff1fd
    url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-19/10addfe7732641598f181acf9ed309e0.png')
    no-repeat 0 0/100% 100%;

  .msg1 {
    margin: 34rpx 0 20rpx;
  }
}

.agree-btn {
  font-size: 40rpx;
  width: 600rpx;
  color: $theme;
  height: 96rpx;
  margin: 60rpx 0 26rpx;
  border-radius: 48rpx;
  background-image: url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-19/193325fae6824e2c89aa2a46eeafd389.png');
}
.no-agree-btn {
  font-size: 30rpx;
  color: #999;
  text-align: center;
  text-decoration: underline;
}
.title {
  font-size: 42rpx;
  text-align: center;
  font-weight: 520;
}
.text {
  color: $theme;
  text-decoration: underline;
  text-decoration-color: $theme;
}
.privacy-agin {
  flex-direction: column;
  font-size: 13px;
  width: 640rpx;
  height: 900rpx;
  padding: 0rpx 30rpx 10rpx;
  border-radius: 12rpx;
  background: #61a8ee
    url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-21/1c515951acc24f54b05429b9082817c0.png')
    no-repeat left top/cover;
  .logo2 {
    width: 164rpx;
    height: 120rpx;
    margin-bottom: 36rpx;
  }
  .agree-btn2 {
    font-size: 32rpx;
    width: 406rpx;
    height: 100rpx;
    margin-bottom: 30rpx;
    background-image: url('https://img.carlsberg.cn/container-reference/azure-crm/2023-12-19/8f672983f1e84e9f9cc787741a294db3.png');
  }
  .msg {
    font-size: 30rpx;
    margin: 40rpx 0 60rpx;
    line-height: 1.6;
    padding: 0 16rpx;
  }
}
</style>
