import { sha512 } from '@/service/sha/sha512.js';
export default class S {
  secretKey: string;
  constructor(key: string) {
    this.secretKey = key || 'secretKeyForfhxyXcx';
  }
  t() {
    const timezone = 8; //目标时区时间，东八区   东时区正数 西市区负数
    const offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    return targetDate.getTime();
  }
  tamp(nowTime: number, backTime: number) {
    const timestemp = nowTime - backTime;
    uni.setStorageSync('tmp', timestemp);
  }
  s() {
    const tmp = uni.getStorageSync('tmp');
    const nowDate = new Date().getTime();
    const t = nowDate - tmp;
    const str = t + this.secretKey;
    const result = sha512(str);
    return {
      t,
      sign: result
    };
  }
}
