import { config } from './config/index';
import { reloadLogin } from '@/hooks/authorization';
import { sendSentryError } from '@/utils/sentry';
import { useMainStore } from '@/stores/main';
import { wxLog } from '@/utils/wxLog';
const AppEnv = uni.getAccountInfoSync().miniProgram.envVersion;
import { ErrorCode } from '@/utils/errorCode';

export const request = (
  url: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  data: any = {},
  headers: any = {},
  retryCount = 0
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const store = useMainStore();

    uni.request({
      url: config.baseURL + url,
      method,
      data,
      header: {
        ...config.headers,
        ...headers
      },
      success(res: any) {
        if (res.statusCode !== 200) {
          wxLog.error('请求失败', JSON.stringify(res));
          uni.showToast({
            title: res.msg || '服务器忙! 请稍后再试!^_^!',
            icon: 'none'
          });
          sendSentryError('error', data, url, store.userInfo, res.data, config.headers);
          reject(res.data);
        } else {
          const { code } = res.data;
          // 日志上报
          if (code !== 0) {
            if (ErrorCode.includes(String(code))) {
              sendSentryError('error', data, url, store.userInfo, res.data, config.headers);
            } else {
              sendSentryError('warning', data, url, store.userInfo, res.data, config.headers);
            }
          }

          // 请求页面接口时候token过期
          if (res.data.code === 9007) {
            const currChannel = getApp().globalData.channel;
            reloadLogin(currChannel);
          } else {
            resolve(res.data);
          }
        }
      },
      fail(err: any) {
        wxLog.error('请求出错', JSON.stringify(err));
        if (!['600001', '600003'].includes(err.errno)) {
          sendSentryError('error', data, url, store.userInfo, err, config.headers);
        } else {
          sendSentryError('warning', data, url, store.userInfo, err, config.headers);
        }

        // 失败时自动重试一次
        if (retryCount === 0) {
          retryCount++;
          const currChannel = getApp().globalData.channel;
          reloadLogin(currChannel)
            .then()
            .catch(() => {
              uni.showToast({
                title: err || '服务器忙! 请稍后再试!^_^!',
                icon: 'none'
              });
              reject(err);
            });
        } else {
          uni.showToast({
            title: err || '服务器忙! 请稍后再试!^_^!',
            icon: 'none'
          });
          reject(err);
        }
      }
    });
  });
};

export const login = () => {
  return new Promise<void>((resolve, reject) => {
    uni.login({
      success(res) {
        // 调用登录接口
        request('login', 'POST', { code: res.code })
          .then((res) => {
            // 保存 token 到本地缓存
            uni.setStorageSync(`${AppEnv}-token`, res.data.token);
            // 更新请求头的 Authorization 字段
            config.headers.Authorization = `Bearer ${res.data.token}`;
            resolve();
          })
          .catch(reject);
      },
      fail(err) {
        reject(err);
      }
    });
  });
};
