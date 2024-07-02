import { request } from '@/service/request';
import type { ApiResponse } from '@/types/interface';
import { initRes } from './main';
import { feedbackList } from './mock';
interface LoginParams {
  code: string;
}
export interface ApiParams {
  [key: string]: any;
}

export const userLogin = (params: LoginParams) => {
  return new Promise((resolve, reject) => {
    request('login', 'POST', params).then(resolve, reject);
  });
};

// 注销
export const userLogout = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('member/withdraw', 'POST', params).then(resolve, reject);
  });
};

// 注销前查询是否有未完成订单
export function checkHasOrder(params: ApiParams) {
  return new Promise((resolve, reject) => {
    request('member/withdraw/valid', 'POST', params).then(resolve, reject);
  });
}
// 绑定手机号
export const bindPhone = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('bindPhone', 'POST', params).then(resolve, reject);
  });
};
//  用户经纬度解析
export const userLocation = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('member/location', 'POST', params).then(resolve, reject);
  });
};
// 用户总积分
export const totalPoint = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('point/total', 'POST', params).then(resolve, reject);
  });
};
// 扫码
export const scanCode = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('code/market', 'POST', params).then(resolve, reject);
  });
};

// 判断某个码是否需要强制授权
export const checkLocation = (params: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    request('code/checkLocation', 'POST', params).then(resolve, reject);
  });
};

// 保存订阅消息
export const saveSubscribe = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('message/save', 'POST', params).then(resolve, reject);
  });
};
// 系统消息
export const systemLog = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    resolve({
      code: 0,
      data: {
        totalReadFlag: 1
      },
      msg: 'ok'
    });
    return;
    request('system/log/check', 'POST', params).then(resolve, reject);
  });
};

// 问题与建议 获取问题列表
export const getFeedbackType = (): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: feedbackList
    });
    return;
    request('feedback/feedbackType', 'POST').then(resolve, reject);
  });
};

// 问题与建议 获取问题列表
export const submitFeedback = (params: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: '反馈成功'
    });
    return;
    request('feedback/feedback', 'POST', params).then(resolve, reject);
  });
};
