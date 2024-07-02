/**
 * UniApp官方并没有完全做到所有API都兼容Vue3
 * 此文件使用Vue2 Mixin写法兼容实现某些API的全局方法
 * 请尽可能使用Vue3写法，此处只写Vue3不兼容的全局方法
 */

import { getShareFromParams } from '../utils/index';
export default {
  data() {
    return {};
  },

  globalData: {
    q: '',
    userInfo: {},
    channel: {
      registerChannel: '',
      registerSubChannel: ''
    }
  },

  onLoad() {
    // 禁用 分享到朋友圈 按钮
    wx.hideShareMenu({
      menus: ['shareTimeline']
    });
  },

  onShareTimeline() {
    return {
      // title: '分享到朋友圈啦啦啦',
      // path: '/pages/index/index',
      // imageUrl:
      //   'https://img.carlsberg.cn/container-reference/azure-crm/2024-01-09/1dbd000c54d6439da9c7069737fa3d6e.png'
    };
  },

  // 默认的全局分享
  onShareAppMessage() {
    return {
      title: '得闲就喝，来风花雪月，果味清爽，轻盈如风!',
      path: `/pages/loading/loading?${getShareFromParams()}`,
      imageUrl:
        'https://img.carlsberg.cn/container-reference/azure-crm/2024-01-17/8bc26e916c95443eb8216a8767340708.png'
    };
  }
};
