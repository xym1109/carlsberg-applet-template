import { useMainStore } from '@/stores/main';
import { useScanCode } from '@/hooks/useScanCode';
import { throttle } from './auxiliaryEvent';
import { saveSubscribe } from '../service/api/user';
import type { SubscribeParamsType, GenericArray } from '@/types/interface';

// 更新小程序最新版本
function updateManager(this: any) {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启小程序？',
            showCancel: false,
            success(res: any) {
              if (res.confirm) {
                updateManager.applyUpdate();
              } else {
                self.updateManager();
              }
            }
          });
        });

        // 新版本下载失败
        updateManager.onUpdateFailed(function () {
          uni.showModal({
            title: '新版本下载失败',
            content: '请您删除当前小程序，重新搜索打开哟~'
          });
        });
      }
    });
  } else {
    uni.showModal({
      title: '温馨提示',
      content: '当前微信版本过低，无法正常使用小程序，请升级到最新微信版本后重试。',
      showCancel: false
    });
  }
}

// 获取小程序系统信息
const getSystemInfo = () => {
  const store = useMainStore();
  uni.getSystemInfo({
    success: (res) => {
      const { platform, statusBarHeight, osName, osVersion, model, screenHeight, screenWidth } =
        res;
      console.log(platform, osName, osVersion, model, screenWidth, screenHeight);
      store.$patch({
        navBarHeight: +statusBarHeight! + 45,
        systemInfo: {
          osName: osName,
          screenHeight: screenHeight,
          screenWidth: screenWidth,
          statusBarHeight: statusBarHeight + ''
        }
      });
    },
    fail: () => {
      uni.showToast({
        title: '系统出错!',
        icon: 'none'
      });
    }
  });
};

// 埋点随机数
const getTrackerShareId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 分享参数
const getShareFromParams = () => {
  const store = useMainStore();
  const { openId, unionId } = store.userInfo;
  let fromParams = `shareid:${getTrackerShareId()};frmopnid:${openId};frmunid:${unionId}`;
  return `from=${fromParams}`;
};

/**
 * 当前打开应用平台判断
 * uni.getSystemInfoSync().platform
 * @return {*}  {string}
 */
const getPlatform = (): string => {
  let platform: string;
  // #ifdef APP-PLUS
  platform = 'APP';
  // #endif

  // #ifdef H5
  platform = 'H5';
  // #endif

  // #ifdef MP-WEIXIN
  platform = 'WX';
  // #endif

  // #ifdef MP-ALIPAY
  platform = 'MY';
  // #endif

  // #ifdef MP-TOUTIAO
  platform = 'DY';
  // #endif

  return platform;
};

/**
 *  @description 根据不同的 jumptype 跳转目标页面
 *  @param hasActivityParam: 跳转H5（活动）页面，是否需要手动在url拼接入参。 1 =>需要配置，0 =>不需要配置
 */
const jumpEvent = function (item: ObjType, callback?: () => void) {
  if (item) {
    const store = useMainStore();
    let webviewUrl;
    const { scanCodeHandle } = useScanCode();

    const { jumptype, appid, href } = item;
    switch (jumptype) {
      // 跳转 H5 webview页面
      case 2:
        webviewUrl = `/pages/webview/webview?url=${href}`;
        uni.navigateTo({
          url: webviewUrl,
          fail: () => {
            uni.switchTab({
              url: '/pages/index/index'
            });
          }
        });
        break;
      // 3.内部页面
      case 3:
        uni.navigateTo({
          url: href,
          fail: () => {
            uni.switchTab({
              url: '/pages/index/index'
            });
            store.$patch({
              activityTab: 1
            });
          }
        });
        break;
      // 4.小程序
      case 4:
        uni.navigateToMiniProgram({
          path: href,
          appId: appid,
          success() {
            console.log('跳转成功');
          },
          fail(err: any) {
            console.log(err);
          }
        });
        break;
      // 5.跳转视频,自己处理
      case 5:
        console.log('跳转视频');
        typeof callback === 'function' && callback();
        break;
      // 7.去扫码
      case 7:
        scanCodeHandle();
        break;
      default:
        typeof callback === 'function' && callback();
    }
  } else {
    uni.showToast({
      title: '目标页面参数错误!',
      icon: 'none'
    });
  }
};

// 获取当前路由
const getAppPage = () => {
  const pages: GenericArray<any> = getCurrentPages();
  const page = pages[pages.length - 1];
  return page;
};

/**
 * 打开订阅消息
 * @param {Array} ids 数组
 * @param {Function} success 订阅成功
 * @param {Function} fail 订阅失败
 * @param {Function} cb 订阅结束后的回调函数
 */
const openSubscribeModel = async function ({
  ids = [],
  success = () => {},
  fail = () => {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  cb = (_res: any) => {}
}: SubscribeParamsType) {
  if (ids.length > 3 || ids.length <= 0) {
    console.log(`openSubscribeModel模板消息数为:${ids.length}个，不符合模板规范`);
    typeof cb === 'function' && cb(null);
    return;
  }
  // 微信模板消息提示
  uni.requestSubscribeMessage({
    tmplIds: ids,
    success() {
      typeof success === 'function' && success();
    },
    fail(err: any) {
      typeof fail === 'function' && fail();
      console.log(err);
    },
    complete(res: any) {
      // console.log('订阅消息结束=>', res);
      const result = res;
      delete result.errMsg;
      const keys = Object.keys(res);
      for (let key of keys) {
        if (res[key] === 'accept') {
          saveSubscribe({
            tmplIds: result
          });
        }
      }
      typeof cb === 'function' && cb(res);
    }
  });
};

// 手机号码隐藏中间四位数
const phoneFormatter = (str: string) => {
  return str ? str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : str;
};

// 客服插件初始化
const initPlugin = (cb: Function) => {
  const store = useMainStore();
  if (store.isInitChat) {
    typeof cb === 'function' && cb();
    return;
  }
  const plugin = requirePlugin('chatbot');
  const guideList = ['会员', '积分', '兑礼', '扫码机制', '扫码异常', '人工'];
  const welcome = `您好，欢迎光临【风花雪月微微醺酒馆】小程序~”得闲就饮风花雪月“请问有什么可以帮到您的吗？
    回复【会员】了解风花雪月微微醺酒馆会员注册&会员权益
    回复【积分】了解风花雪月微微醺酒馆会员积分获取攻略
    回复【兑礼】了解风花雪月微微醺酒馆会员兑礼机制
    回复【扫码机制】了解风花雪月产品瓶盖/拉环内二维码扫码机制
    回复【扫码异常】反馈扫码问题
    回复【人工】以上都不能解决问题，需人工回复
  `;
  const { openId, avatar, nickname } = store.userInfo;
  console.log('userInfo.openId============================>>>', openId);
  if (openId) {
    plugin.init({
      appid: 'ooCaaYX3XIYoyVZY9VedY95wSLiYcb',
      openid: openId, //用户的openid，必填项，可通过wx.login()获取code，然后通过后台接口获取openid
      robotHeader:
        'https://img.carlsberg.cn/container-reference/azure-crm/2024-01-12/2cdf4c1b54bf48f3b391d17ddf9bc1e8.png',
      userHeader:
        avatar ||
        'https://img.carlsberg.cn/container-reference/azure-crm/2024-01-12/d523310f95ec4c8a93c01aaddef7df59.png', // 用户头像
      userName: nickname || '微信用户', // 用户昵称
      history: false,
      navHeight: store.navBarHeight,
      guideList,
      welcome,
      anonymous: false, // 是否允许匿名用户评价，默认为false，设为ture时，未传递userName、userHeader两个字段时将弹出登录框
      success: () => {
        store.$patch({
          isInitChat: true
        });
        typeof cb === 'function' && cb();
      },
      fail: () => {}
    });
  }
};

export {
  updateManager,
  getSystemInfo,
  getShareFromParams,
  getPlatform,
  throttle,
  jumpEvent,
  getAppPage,
  openSubscribeModel,
  phoneFormatter,
  initPlugin
};
