import { getShareFromParams } from '@/utils/index';

export const useShare = () => {
  const shareInfo = ref({
    title: '',
    imageUrl: '',
    path: ''
  });

  // 自定义分享
  const customShareMessage = (cb: Function = () => {}) => {
    wx.onAppRoute(() => {
      const pages = getCurrentPages();
      const currentRoute = pages[pages.length - 1];
      // 重写全局分享 (即覆盖默认的分享信息)
      currentRoute.onShareAppMessage = (res) => {
        shareInfo.value = cb(res) || {};
        // 合并子分享和全局分享
        const { title, imageUrl, path } = shareInfo.value;
        return {
          title: title || '得闲就喝，来风花雪月，果味清爽，轻盈如风!',
          imageUrl:
            imageUrl ||
            'https://img.carlsberg.cn/container-reference/azure-crm/2024-01-17/8bc26e916c95443eb8216a8767340708.png',
          path: path ? formateSharePath(path) : `/pages/loading/loading?${getShareFromParams()}`
        };
      };
    });
  };

  // path加上埋点参数
  const formateSharePath = (path = '') => {
    const isShareParams =
      path.includes('shareid;') && path.includes(';frmopnid:') && path.includes(';frmunid:');

    // 如果写了埋点参数
    if (isShareParams) {
      return path;
    }

    // 没写埋点参数 手动拼上
    const cusSymbol = path.includes('?');
    // console.log(path, cusSymbol);

    if (cusSymbol) {
      return `${path}&${getShareFromParams()}`;
    } else {
      return `${path}?${getShareFromParams()}`;
    }
  };

  return { customShareMessage };
};
