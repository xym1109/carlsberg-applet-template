/**
 * auxiliaryEvent.ts
 * @description 项目中通用工具类辅助函数
 */

import type { ObjType } from '@/types/interface';

// 节流函数
function throttle(fn: (...args: any[]) => void, wait = 500): (...args: any[]) => void {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}

// 是否为空Proxy
const isEmptyProxy = (proxyObj: ObjType) => {
  const targetObj = proxyObj.__v_raw; // 获取代理对象所代理的目标对象
  if (!targetObj || typeof targetObj !== 'object') {
    return true; // 如果目标对象不存在或者不是对象，则返回空
  }
  // 如果目标对象没有自身属性，则返回空
  return Object.keys(targetObj).length === 0;
};

export { throttle, isEmptyProxy };
