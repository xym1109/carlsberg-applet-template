import { carlsberg } from '@/utils/track';
import { waitLaunchedEvent } from './index';
import { config } from '@/service/config/index';
import { useMainStore } from '@/stores/main';
import { userLogin, fetchUserInfo } from '@/service/api/main';
import { wxLog } from '@/utils/wxLog';

type ChannelType = {
  registerChannel: string | '';
  registerSubChannel: string | '';
};

const appEnv = uni.getAccountInfoSync().miniProgram.envVersion;
let tokenCallbackList: (() => void)[] = [];
let getUserInfoCallbackList: (() => void)[] = [];

/**
 * 用户登录状态处理
 * @param {Object} 用户信息
 * @param {Function} 有token后的回调函数
 */
export const withLogin = async (channel: ChannelType) => {
  try {
    const token = await checkSession();
    if (token) {
      getUserInfo({});
      tokenCallbackList.forEach((func) => func?.());
      tokenCallbackList = [];
    } else {
      reloadLogin(channel);
    }
  } catch (error) {
    console.warn('没有token，token过期或者失效,开始ReloadLogin...');
    reloadLogin(channel);
  }
};

/**
 * 检查登录态是否过期
 * @param {Function}  success -- session_key 未过期，并且在本生命周期内将一直有效
 * @param {Function}  fail -- session_key 已经失效，需要重新执行登录流程
 * @return {Promise Function}
 */
const checkSession = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.checkSession({
      success() {
        const token = uni.getStorageSync(appEnv + '-token');
        if (token) {
          resolve(token);
        } else {
          reject('checkSession_token_error');
        }
      },
      fail() {
        reject('session_key_error');
      }
    });
  });
};

/**
 * @description token不存在(冷启动进入小程序)或过期 session_key失效时
 * @param {Object} data -- 登录信息
 * @return {Promise Function}
 */
export const reloadLogin = async (channel: ChannelType) => {
  uni.removeStorageSync(appEnv + '-token');
  getApp().globalData.channel = channel;
  try {
    uni.showLoading({
      title: '登录中...',
      mask: true
    });
    const code = await getLoginCode();
    try {
      const result: any = await userLogin({ code, ...channel });
      if (result.code !== 0) {
        wxLog.error('登录失败', JSON.stringify(result));
        uni.hideLoading();
        uni.showToast({
          title: '登录失败，请重新进入小程序',
          icon: 'none',
          duration: 5000
        });
        return;
      }
      const typedResult = result as { data: { token: string } };
      const { token } = typedResult.data;
      // 登录成功设置token
      config.headers.Authorization = `Bearer ${token}`;
      uni.setStorageSync(`${appEnv}-token`, token);
      // console.log('token', token);

      // 登录成功开始获取用户信息
      uni.hideLoading();
      getUserInfo({
        fail: () => {
          uni.showToast({
            title: '获取用户信息失败!',
            icon: 'none'
          });
        }
      });
      tokenCallbackList.forEach((func) => func?.());
      tokenCallbackList = [];
      return new Promise((resolve) => {
        resolve({
          ...result.data.data,
          openid: result.data['openid']
        });
      });
    } catch (error) {
      console.log(error);
      uni.hideLoading();
    }
  } catch (err) {
    uni.hideLoading();
  }
};

/**
 * 获取小程序的code
 */
const getLoginCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          wxLog.error('获取code失败', JSON.stringify(res));
          uni.showToast({
            title: '登录失败，请重新进入小程序',
            icon: 'none',
            duration: 3000
          });
        }
      },
      fail: (err: any) => {
        wxLog.error('获取code出错', JSON.stringify(err));
        uni.showToast({
          title: '登录失败，请重新进入小程序',
          icon: 'none',
          duration: 3000
        });
        reject(err);
      }
    });
  });
};

/**
 * 获取用户信息
 *  @param {Function} success 获取用户信息成功的回调函数
 *  @param {Function} fail 获取用户信息成功失败的回调函数
 *  @param {Function} complete 执行结束后的回调函数
 * */
export const getUserInfo = async ({
  success,
  fail,
  complete
}: {
  success?: () => void;
  fail?: (error: any) => void;
  complete?: (res: any) => void;
}) => {
  uni.showLoading({
    title: '加载中...',
    mask: true
  });
  const store = useMainStore();

  let res: any = {};
  try {
    res = await fetchUserInfo({});
    const { openId, point } = res.data || {};
    // 埋点设置openid
    carlsberg('set', 'user', 'openid', openId);
    getApp().globalData.userInfo = res.data;
    store.$patch({
      userInfo: res.data,
      userTotalPoints: point,
      isGetUserInfo: true
    });
    wxLog.info('获取用户信息数据', JSON.stringify(res.data), store.userInfo.mobile);
    // console.log('store', store.isGetUserInfo, store.userInfo.mobile);
    waitLaunchedEvent.setLaunched(true);
    typeof success === 'function' && success();

    getUserInfoCallbackList.forEach((func) => func?.());
    getUserInfoCallbackList = [];
    uni.hideLoading();
  } catch (error) {
    uni.hideLoading();
    wxLog.error('获取用户信息失败', JSON.stringify(error));
    waitLaunchedEvent.setLaunched(true);
    typeof fail === 'function' && fail(error);
  }
  typeof complete === 'function' && complete(res);
};

/**
 * 获取到token之后执行的函数
 * @param {Function} cb 回调函数
 */
export const afterTokenHooks = (cb: () => void) => {
  const token = uni.getStorageSync(appEnv + '-token');
  if (token) {
    typeof cb === 'function' && cb();
  } else {
    tokenCallbackList.push(cb);
  }
};

/**
 * 获取到用户信息之后执行的钩子函数
 * @param {Function} cb 回调函数
 */
export const afterUserInfoHooks = (cb: () => void) => {
  const store = useMainStore();
  const { isGetUserInfo } = store;
  if (isGetUserInfo) {
    typeof cb === 'function' && cb();
  } else {
    getUserInfoCallbackList.push(cb);
  }
};
