import { useMainStore } from '@/stores/main';
import service from '@/service/index';
import { getAppPage } from '@/utils/index';
import { initLocation, authPhone } from '@/hooks/index';
import { wxLog } from '@/utils/wxLog';
import { Track } from '@/utils/track';

export const useScanCode = () => {
  wxLog.addFilterMsg('scanCode_log');
  const store = useMainStore();
  const bottleCapCode = ['Z1']; //瓶盖码
  const bottleBodyCode = ['https://wfsmccopenapi.carlsberg.cn']; // 瓶身码

  const scanCodeHandle = () => {
    initLocation(() => {
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: (res) => {
          const currentData = res;
          wxLog.info('scanCodeHandle:', JSON.stringify(store.userInfo));
          const codeUrl = currentData.result;
          parseScanCode(codeUrl);
        },
        fail: (error) => {
          store.$patch({
            needAuthPhoneAndLocation: false
          });
          console.warn('识别失败：', error);
        }
      });
    });
  };

  // 从微信扫一扫进入检查是否已是会员
  const fromWxAppAuthHandle = (code: string) => {
    authPhone(code, (code) => {
      parseScanCode(code);
    });
  };

  /**
   * 从微信扫一扫进入处理各种场景的授权状态
   * @access needAuthPrivacy: 隐私协议
   * @access isLocationExpires: 地理位置缓存标识
   * @description 如：用户删掉小程序、清除App缓存或小程序授权周期机制，再次进入小程序都需重新授权
   * */
  const scanCodeFromWxApp = (q: string) => {
    const { needAuthPrivacy } = store;
    const isLocationExpires = uni.getStorageSync('locationAuthState');
    if (!needAuthPrivacy) {
      initLocation(() => {
        fromWxAppAuthHandle(q);
      });
    } else {
      uni.$on('privacyEvent', () => {
        if (!isLocationExpires) {
          initLocation(() => {
            fromWxAppAuthHandle(q);
          });
        } else {
          store.$patch({
            needAuthPhoneAndLocation: true
          });
          fromWxAppAuthHandle(q);
        }
      });
    }
  };

  // 判断某个码是否需要强制授权
  const codeCheckLocation = async (code: string, subdomain: string) => {
    try {
      const res = await service.checkLocation({
        code,
        subdomain,
        type: 0
      });
      if (res.code !== 0) {
        scanBottleCapsFailHandle(res.code, res.title, res.msg);
      }
      return new Promise((resolve) => {
        res.code === 0 ? resolve(res.data) : resolve(res.msg);
      });
    } catch (error) {
      wxLog.error('瓶盖码判断是否需要授权位置失败:', JSON.stringify(error));
      console.error('扫码出错啦！', error);
    }
  };

  // 处理瓶盖码数据
  const bottleCapCodeHandle = async (code: string, subdomain: string) => {
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
    // uni.$on('scanCodeEvent', (params) => {
    //   scanCodeSuccessHandle(params);
    // });
    try {
      const params = {
        code,
        subdomain,
        type: 0
        // la: locationInfo.lat,
        // lo: locationInfo.lng
      };

      wxLog.info('瓶盖码接口入参数据:', JSON.stringify(params));
      const result: any = await service.scanCode(params);
      if (result.code !== 0) {
        scanBottleCapsFailHandle(result.code, result.title, result.msg);
        uni.hideLoading();
        return;
      }
      wxLog.info('瓶盖码成功后数据:', JSON.stringify(result));
      store.$patch({
        scanCodeData: result.data
      });
      let scanCodeData = {
        code,
        ...result.data
      };
      // uni.$emit('scanCodeEvent', scanCodeData);
      scanCodeSuccessHandle(scanCodeData);
      uni.hideLoading();
    } catch (error) {
      uni.hideLoading();
      wxLog.error('瓶盖码接口请求失败:', JSON.stringify(error));
      console.error('扫码出错啦！', error);
    }
    getApp().globalData.q = '';
  };

  /**
   * 扫码成功后需要处理的事件
   * @returns { activityType = 0: 常规扫码; 1: 标准UTC;  activityId: 活动ID }
   * */
  const scanCodeSuccessHandle = async (data: ObjType) => {
    console.log('scanCodeSuccessHandle扫码成功:', data);
    const { code, activityId, activityType } = data;
    switch (activityType) {
      case 1:
        if (activityId) {
          const { locationInfo } = store;
          uni.navigateTo({
            url: `/subpackages/activities/utc/webview?code=${code}&activityId=${activityId}&sourceType=activity&la=${locationInfo.lat}&lo=${locationInfo.lng}`
          });
        }
        break;
      // 一元换购活动
      case 3:
        {
          const page = getAppPage();
          const url = `/subpackages/activities/oneYuanPurchase/drawPrize?code=${code}`;
          if (page.route === 'subpackages/activities/oneYuanPurchase/drawPrize') {
            // console.log('当前页面是：', page);
            uni.redirectTo({
              url: url
            });
          } else {
            uni.navigateTo({
              url: url
            });
          }
        }
        break;
      // 春日UTC活动
      case 4:
        {
          // 到春天UTC落地页显示开奖弹窗
          const page = getAppPage();
          const targetUrl = 'subpackages/activities/springUTC/index';
          if (page.route !== targetUrl) {
            uni.navigateTo({
              url: `/${targetUrl}`,
              success: () => {
                store.$patch({
                  utcShowDrawPopup: true
                });
              }
            });
          } else {
            store.$patch({
              utcShowDrawPopup: true
            });
          }
        }
        break;
      // 默认常规扫码送积分
      default:
        upDateTotalPoints();
        break;
    }
  };

  /**
   * @description 处理扫码失败的各种场景: 错误码
   * @alias 2003: 达到当日扫码次数上限
   * @alias 2046: 休息一会儿，请稍后再试 扫码过于频繁
   * @alias 2047: 该二维码已被使用，请换一个继续参与活动 重复扫码
   * @alias 2049: 扫码失败 未获取到二维码信息，请稍后再试
   * @alias 2045: 请扫描活动产品参与活动 非当前活动二维码
   * @alias 9999: 未授权地理位置
   */
  const scanBottleCapsFailHandle = (errCode: number, errTitle: string, errMsg: string) => {
    wxLog.warn('扫码失败数据:', errCode, errMsg);
    switch (errCode) {
      // 没有授权地理位置
      case 9999:
        store.$patch({
          showNoLocationPopup: true
        });
        break;
      case 2049:
      case 5015:
        store.$patch({
          scanCodeFailMsg: {
            title: errMsg,
            msg: errTitle,
            errCode: errCode
          },
          scanCodeFailPopup: true
        });
        break;
      default:
        store.$patch({
          scanCodeFailMsg: {
            title: errTitle,
            msg: errMsg,
            errCode: errCode
          },
          scanCodeFailPopup: true
        });
        break;
    }
  };

  // 解析扫码类型code
  const parseScanCode = async (codeUrl: string) => {
    const q = decodeURIComponent(codeUrl);
    try {
      if (bottleBodyCode.includes(q)) {
        const { userInfo } = store;
        console.log('瓶身码');
        userInfo.mobile && getBottleBodyRule();
      } else {
        const scanTypeList = [...bottleCapCode];
        const regex = /(.+)\/(.+)\/(.+)/;
        const reg = q.match(regex)!;
        const host = reg[1];
        const subdomain = reg[2];
        const code = reg[3];
        wxLog.info(
          `当前品牌子域名应是${scanTypeList}, host:${host}, subdomain: ${subdomain}, 码: ${code}`
        );
        const { locationInfo } = store;
        if (!locationInfo.lat && !locationInfo.lng) {
          // 判断这个码是否需要强制授权位置，是的话打开授权指引弹窗
          const checkResult = await codeCheckLocation(code, subdomain);
          console.log('这个码需要强制授权吗：', checkResult);
          if (typeof checkResult === 'boolean') {
            if (checkResult) {
              Track('spring_activity_2024', 'pop', 'location_authorization_window');
              store.$patch({
                utcScanLocationGuide: true,
                saveCodeInfo: { code, subdomain }
              });
            } else {
              bottleCapCodeHandle(code, subdomain);
            }
          }
          return;
        }
        bottleCapCodeHandle(code, subdomain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 更新用户总积分
  const upDateTotalPoints = async () => {
    try {
      let pointData: any = await service.totalPoint({});
      store.$patch({
        scanCodePopup: true,
        userTotalPoints: pointData.data?.total || 0
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 瓶身码活动规则
  const getBottleBodyRule = async () => {
    try {
      const res: any = await service.getRuleInfo({ code: 'WFSM' });
      if (res.data) {
        store.$patch({
          showActivityRule: true,
          bottleBodyRule: {
            title: res.data?.title,
            content: res.data?.content
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    bottleBodyCode,
    scanCodeHandle,
    scanCodeFromWxApp,
    bottleCapCodeHandle
  };
};
