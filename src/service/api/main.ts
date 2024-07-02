import { request } from '@/service/request';
import type { ApiResponse } from '@/types/interface';
import {
  allBannerList,
  homeOperationList,
  ruleList,
  pointList,
  updateUserAndTask,
  loadingSource,
  brandList
} from './mock';
interface LoginParams {
  code: string;
}
export interface ApiParams {
  [key: string]: any;
}

export const initRes = {
  code: 0,
  data: null,
  msg: 'ok'
};

export const userLogin = (params: LoginParams) => {
  return new Promise((resolve, reject) => {
    request('login', 'POST', params).then(resolve, reject);
  });
};

export const fetchUserInfo = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    // const userInfo = JSON.parse(uni.getStorageSync('initUserInfo'));
    // resolve({
    //   ...initRes,
    //   data: userInfo
    // })
    request('member/info', 'POST', params).then(resolve, reject);
  });
};
// 更新保存用户任务信息
export const expansionInfo = (params: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    updateUserAndTask(params);
    resolve({
      ...initRes,
      data: null
    });
    return;
    request('member/update/expansionInfo', 'POST', params).then(resolve, reject);
  });
};
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
//  清除后端缓存的经纬度信息
export const clearLocation = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('member/location/clear', 'POST', params).then(resolve, reject);
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

// 保存订阅消息
// export const saveSubscribe = (params: ApiParams) => {
//   return new Promise((resolve, reject) => {
//     request('message/save', 'POST', params).then(resolve, reject);
//   });
// };
// 规则列表
export const getRulesList = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0) {
      resolve({
        ...initRes,
        data: ruleList
      });
    }
    return;
    request('rule/list', 'POST').then(resolve, reject);
  });
};
export const getRuleInfo = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0) {
      resolve({
        ...initRes,
        data: ruleList.find((item) => item.code === params.code)
      });
    }
    return;
    request('rule/info', 'POST', params).then(resolve, reject);
  });
};
// 首页Banner和弹窗
export const indexList = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: allBannerList
    });
    return;
    request('banner/index', 'POST', params).then(resolve, reject);
  });
};
// 运营悬浮位
export const floatPopup = (params?: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: homeOperationList
    });
    return;
    request('floatPopup/list', 'POST', params).then(resolve, reject);
  });
};
// 任务列表
export const missionList = (params?: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: JSON.parse(uni.getStorageSync('taskList'))
    });
    return;
    request('mission/list', 'POST', params).then(resolve, reject);
  });
};
// 获取用户总积分值
export const getTotalPoint = (params?: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: {
        total: 100
      }
    });
    return;
    request('point/total', 'POST', params).then(resolve, reject);
  });
};
// 积分列表
export const getPointsList = (params: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0) {
      resolve({
        ...initRes,
        data: {
          pages: 1,
          size: 10,
          total: pointList.length,
          records: pointList
        }
      });
    }
    return;
    request('point/info', 'POST', params).then(resolve, reject);
  });
};
// 注销前查询是否有未完成订单
export function checkHasOrder(params: ApiParams) {
  return new Promise((resolve, reject) => {
    request('member/withdraw/valid', 'POST', params).then(resolve, reject);
  });
}
// 系统消息
// export const systemLog = (params: ApiParams) => {
//   return new Promise((resolve, reject) => {
//     request('system/log/check', 'POST', params).then(resolve, reject);
//   });
// };
// 系统消息列表
export const systemLogList = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    const init = {
      code: 'task',
      content: '新玩法新刺激，赶紧来做任务获取更多积分吧！',
      createTime: '2024-01-09',
      href: '/subpackages/personalCenter/myTasks/index',
      jumpType: 3,
      title: '做任务，得积分'
    };
    resolve({
      ...initRes,
      data: {
        records: [init],
        total: 1
      }
    });
    request('system/log/list', 'POST', params).then(resolve, reject);
  });
};
export const readLog = (params: ApiParams) => {
  return new Promise((resolve, reject) => {
    request('system/log/read', 'POST', params).then(resolve, reject);
  });
};

// 品牌活动
export const getActivityList = (params?: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    resolve({
      ...initRes,
      data: brandList
    });
    request('banner/brand', 'POST', params).then(resolve, reject);
  });
};

// 活动与问卷
export const getActivityInfo = (params: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    const url =
      params.sourceType === 'question' ? 'activity/getQuestionInfo' : 'activity/getActivityInfo';
    request(url, 'POST', params).then(resolve, reject);
  });
};

// 获取用户完成邀请任务的详情
export const inviteDetail = (params?: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    const init = {
      avatar:
        'https://img.carlsberg.cn/container-reference/azure-crm/2024-01-16/efc962edf553436cb10ef5fb2e42bcca.png',
      nickname: '我是昵称昵称发多少开发了积分',
      inviteTime: '2024-01-26- 11:07:38'
    };
    resolve({
      ...initRes,
      data: {
        inviteRecords: new Array(2).fill(init),
        inviteNum: 2,
        obtainPoint: 10,
        completeStatus: false
      }
    });
    return;
    request('mission/inviteDetail', 'POST', params).then(resolve, reject);
  });
};

// 开屏页loading配置信息
export const getLoadingInfo = (params?: ApiParams): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0) {
      resolve({
        ...initRes,
        // data: loadingSource[Math.floor(Math.random() * loadingSource.length)]
        data: loadingSource[0]
      });
    }
    return;
    request('banner/loading', 'POST', params).then(resolve, reject);
  });
};
