import { useAuth } from '@/hooks/useAuth';
import { useShare } from '@/hooks/useShare';

const { authPhone, initLocation, getPrivacySetting } = useAuth();
export { authPhone, initLocation, getPrivacySetting };

const { customShareMessage } = useShare();
export { customShareMessage };

interface WaitLaunchedEvent {
  onLaunched: boolean;
  callbacks: ((value: boolean) => void)[];

  setLaunched(value: boolean): void;
  registerCallback(callback: (value: boolean) => void): void;
}

// 设置App中onLaunch执行完成的钩子方法
export const waitLaunchedEvent: WaitLaunchedEvent = {
  onLaunched: false,
  callbacks: [],

  // 设置 onLaunched 值
  setLaunched(value: boolean) {
    this.onLaunched = value;

    // 执行所有注册的回调函数
    this.callbacks.forEach((callback) => {
      callback(this.onLaunched);
    });
  },

  // 注册回调函数
  registerCallback(callback) {
    this.callbacks.push(callback);
  }
};

/**
 * @description 执行App中onLaunch完成后的钩子, 解决onLaunch中异步操作时，页面onShow生命周期快于onLaunch的问题
 * @description 常用于小程序首页和直接进入活动落地页
 * @return {Function} Promise
 **/
export function useLaunched(): Promise<void> {
  return new Promise((resolve) => {
    // onLaunched 已经是 true，立即 resolve
    if (waitLaunchedEvent.onLaunched) {
      resolve();
    } else {
      // 否则注册一个回调函数，在 onLaunched 变为 true 时 resolve
      // 即：把 () => { resolve() } ，push到上面 waitLaunchedEvent 的 callbacks 里
      waitLaunchedEvent.registerCallback(() => {
        resolve();
      });
    }
  });
}
