import { getPlatform } from '@/utils/index';
import S from '../sha/s';
interface Urls {
  [key: string]: {
    [val: string]: string;
  };
}
const AppEnv = uni.getAccountInfoSync().miniProgram.envVersion;
/**
 * @type {
 *  develop: 开发环境,
 *  trial: 小程序体验版本,
 *  release: 小程序生产版本,
 *  gray: 小程序灰度版本（支付宝小程序支持）
 *  prod: 生产环境
 * }
 */
const hosts: Urls = {
  WX: {
    develop: 'https://uat-tbgapplet.carlsberg.cn/wfsm/',
    trial: 'https://uat-tbgapplet.carlsberg.cn/wfsm/',
    release: 'https://tbgapplet.carlsberg.cn/wfsm/'
  },
  MY: {
    develop: import.meta.env.VITE_APP_WX_DEV_URL,
    trial: 'https://api-my-dev.example.com',
    release: 'https://api-my-dev.example.com',
    gray: 'https://api-my-dev.example.com'
  },
  H5: {
    develop: import.meta.env.VITE_APP_H5_DEV_URL,
    prod: import.meta.env.VITE_APP_H5_PROD_URL
  }
};

/**
 * 不支持uni.getAccountInfoSync().miniProgram 的平台使用process.env.NODE_ENV即可
 * @return { appId,envVersion,version }
 */
export const getApiBaseUrl = (): string => {
  let platform = getPlatform();
  let appEnv = '';
  switch (platform) {
    case 'H5':
      appEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'develop';
      break;
    case 'WX':
      appEnv = AppEnv;
      break;
    case 'MY':
      appEnv = AppEnv;
      break;

    default:
      break;
  }
  console.log(`当前平台是[${platform}], 环境是[${appEnv}], hostUrl为[${hosts[platform][appEnv]}]`);
  return hosts[platform][appEnv];
};

interface Config {
  baseURL: string;
  headers: {
    Authorization: string;
    timeStamp: number;
    sign: string;
  };
}

// 定义的小程序secretKey
const s = new S('secretKeyForfhxyAXcx');
const { sign, t } = s.s();

export const config: Config = {
  baseURL: getApiBaseUrl(),
  headers: {
    sign,
    timeStamp: t,
    Authorization: `Bearer ${uni.getStorageSync(`${AppEnv}-token`)}`
  }
};
