import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      userInfo: {
        nickname: '微信用户',
        mobile: '',
        avatar: '',
        birthday: '',
        gender: 0,
        location: '',
        openId: '',
        unionId: '',
        memberId: 0
      },
      inviterId: '', // 邀请好友的ID（别人）
      activityCode: '', // 任务code
      authPhonePopup: false,
      authSuccessPopup: false, //授权手机号成功弹窗
      userTotalPoints: 0, //用户总积分
      activityTab: 1,
      privacyPopup: false,
      aginPrivacyPopup: false,
      needAuthPrivacy: true,
      isGetUserInfo: false,
      locationInfo: {
        lat: '',
        lng: '',
        province: '',
        city: '',
        district: ''
      },
      needAuthPhoneAndLocation: false,
      systemInfo: {
        osName: 'ios',
        statusBarHeight: '40',
        screenHeight: 667,
        screenWidth: 375
      },
      navBarHeight: 45,

      scanCodeData: {
        point: 0
      },
      scanCodePopup: false, //扫描成功弹窗
      scanCodeFailMsg: {
        title: '',
        msg: '',
        errCode: 0
      },
      scanCodeFailPopup: false,
      showNoLocationPopup: false,
      bottleBodyRule: {
        title: '',
        content: ''
      },
      showActivityRule: false,
      isInitChat: false,
      // 券合集
      cardrollDialogIsShow: false,
      cardrollDialogData: {
        appid: '',
        path: '',
        title: '',
        content1: '',
        content2: '',
        contentpwd: '',
        btnText: '',
        tap: '',
        type: ''
      },
      smartGoOpenid: '',
      homeActivityPopup: false, // 首页轮播popup弹窗
      /* 首页悬浮运营位视频  start */
      isShowImg: true, // 是否展示视频封面
      isShowFullScreen: false, // 是否为全屏
      isShowSmallScreen: false, // 是否展示视频
      url: '', // 视频链接
      videoPoster: '', // 视频封面图
      autoplay: false, // 视频自动播放
      /* 首页悬浮运营位视频  end */

      utcScanLocationGuide: false, // SKU码对应活动显示地理位置指引弹窗
      utcAllowReScanPopup: false, // 选择允许授权，则显示重新扫码弹窗
      utcShowDrawPopup: false,
      saveCodeInfo: {
        // 保存码的信息
        code: '',
        subdomain: ''
      },
      oneYuanPurchasePopup: {
        purchase: false,
        points: false
      }
    };
  },
  actions: {
    setPhoneNumber(mobile: string) {
      this.userInfo!.mobile = mobile;
    }
  }
});
