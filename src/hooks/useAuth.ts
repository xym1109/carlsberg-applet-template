import { useMainStore } from '@/stores/main';
import { wxLog } from '@/utils/wxLog';
import { userLocation } from '@/service/api/main';
import { Track } from '@/utils/track';

export const useAuth = () => {
  const locationInfo = ref({});

  // 获取用户隐私协议保护状态
  const getPrivacySetting = () => {
    if (uni.canIUse('getPrivacySetting')) {
      wxLog.error('微信App不是最新版本!');
      const store = useMainStore();
      return new Promise((resolve, reject) => {
        wx.getPrivacySetting({
          success: (res: any) => {
            resolve(res.needAuthorization);
            wxLog.info('needAuthorization:', res.needAuthorization);
            if (res.needAuthorization) {
              store.$patch({
                privacyPopup: true
              });
            }
          },
          fail: (err: any) => {
            reject(err);
            console.log(err);
          }
        });
      });
    } else {
      wx.showModal({
        title: '更新提示',
        content: '您的微信版本不是最新的，请升级微信版本后重新进入小程序!',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#293a7f',
        success: (result: any) => {
          if (result.confirm) {
            wx.exitMiniProgram();
          }
        }
      });
    }
  };

  /**
   * 手机号授权成功后的钩子函数
   * @param {Object} event --- 当前事件的数据
   * @param {Function} callback --- 授权完手机号的回调函数
   * @param {Boolean} autoExecute --- 授权完后是否自动执行当前事件，默认为true
   */
  const authPhone = (event: any, callback: (args: any) => void, autoExecute = true) => {
    const store = useMainStore();
    let nextEvent = false;
    wxLog.info(
      'isGetUserInfo:',
      store.isGetUserInfo,
      'AuthPhone:',
      store.userInfo?.mobile,
      JSON.stringify(store.userInfo)
    );
    if (!store.isGetUserInfo) return false;
    if (store.userInfo?.mobile) {
      nextEvent = true;
      if (autoExecute || nextEvent) {
        callback(event);
      }
    } else {
      store.$patch({
        authPhonePopup: true
      });
      uni.$on('phoneAuthorized', () => {
        if (!autoExecute) return;
        callback(event);
      });
    }
  };

  // 初始化地理位置信息
  const initLocation = async (callback?: (data: any) => void) => {
    // 默认设置没有拒绝过授权缓存
    uni.setStorageSync('isDenyLocation', 'ok');
    const isAuthLocation = await authorizeLocation();
    if (isAuthLocation) {
      const locationData = await getLocation();
      callback && callback(locationData);
    } else {
      callback &&
        callback({
          latitude: 0,
          longitude: 0
        });
    }
  };

  // 获取地理位置授权状态
  const authorizeLocation = () => {
    return new Promise((resolve) => {
      uni.authorize({
        scope: 'scope.userLocation',
        success(res) {
          const locationState = res.errMsg === 'authorize:ok' ? true : false;
          resolve(locationState);
        },
        fail(error) {
          wxLog.error('地理位置授权失败或者拒绝', error);
          uni.setStorageSync('isDenyLocation', 'deny');
          console.log('地理位置授权失败或者拒绝', error);
          const locationState = false;
          Track('Pop-ups', 'Click', 'Pop-ups_WeChat_position_not allow');
          resolve(locationState);
        }
      });
    });
  };

  // 调起地理位置授权
  const getLocation = () => {
    return new Promise((resolve) => {
      const store = useMainStore();
      uni.getLocation({
        type: 'wgs84',
        success: (res) => {
          const param = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          saveLocation(res.latitude, res.longitude);
          wxLog.info('WX获取地理位置数据:', JSON.stringify(res));
          locationInfo.value = param;
          store.$patch({
            locationInfo: {
              lat: res.latitude + '',
              lng: res.longitude + ''
            }
          });
          // console.log(res.errMsg);

          const label =
            res.errMsg === 'authorize:fail auth deny'
              ? 'Pop-ups_WeChat_position_not allow'
              : 'Pop-ups_WeChat_position_allow';
          Track('Pop-ups', 'Click', label);
          // console.log('地理位置信息:', store.locationInfo);
          resolve(param);
        },
        fail: (error) => {
          resolve(error);
          wxLog.error('WX授权地理位置出错:', JSON.stringify(error));
          console.log('授权地理位置出错:', error);
        },
        complete: () => {
          uni.setStorageSync('locationAuthState', 'hasLocationCache');
        }
      });
    });
  };

  // 把经纬度传给后端
  const saveLocation = async (lat?: Number, lng?: Number) => {
    const params = {
      lat: lat || '',
      lng: lng || ''
    };
    const locationData: any = await userLocation(params);
    if (locationData.data) {
      const store = useMainStore();
      const { province, city, district } = locationData.data;
      store.$patch({
        locationInfo: {
          province,
          city,
          district
        }
      });
    }
  };

  return {
    locationInfo,
    getPrivacySetting,
    authPhone,
    initLocation
  };
};
