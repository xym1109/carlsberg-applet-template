<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { withLogin } from '@/hooks/authorization';
import { initSentry } from '@/utils/sentry';
import { getPrivacySetting } from '@/hooks/index';
import { updateManager, getSystemInfo } from '@/utils/index';
import { initLocation } from '@/hooks/index';
import { useShare } from '@/hooks/useShare';

const store = useMainStore();
const useAfterToken = inject<any>('useAfterToken');
const appEnv = uni.getAccountInfoSync().miniProgram.envVersion;

onLaunch(async (options: any) => {
  loadFontFace();
  onChannelHandle(options?.query, options?.scene);
  updateManager();
  getSystemInfo();
  initSentry();
  // 自定义分享
  useShare();

  const query = options.query;
  const needAuthorization = await getPrivacySetting();
  store.$patch({
    needAuthPrivacy: needAuthorization as boolean,
    inviterId: query?.inviterId || '',
    code: query?.code || ''
  });

  const locationCache = uni.getStorageSync('locationAuthState');
  !query.q && locationCache && initLocation();

  useAfterToken(() => {
    const token = uni.getStorageSync(appEnv + '-token');
    console.log('App Launch token====:', token, '; 是否需要授权隐私协议:', needAuthorization);
  });
});

// 加载字体
const loadFontFace = () => {
  uni.loadFontFace({
    family: 'FZQingKeBenYueSongS-R-GB',
    global: true,
    source:
      'url("https://img.carlsberg.cn/container-reference/Azure_wusu/2023-12-18/7a0cfe4bf40141edb223bec7fe25c528.TTF")',
    success: () => {
      console.log('字体加载成功');
    },
    fail(res: any) {
      console.log('字体加载失败:', res);
    }
  });
};

/**
 * 处理渠道来源
 *  @description 一级来源名单,必须符合以下来源,才可处理二级动态来源
 *  @argument {'channel_Capscan','channel_Weixin','channel_Share','channel_others'}
 *  @argument {'channel_Activity', 'channel_Subscription', 'channel_Materialscan'}
 */
const onChannelHandle = (query?: any, scene?: number) => {
  let channel = {
    registerChannel: 'channel_Weixin',
    registerSubChannel: 'channel_wfsm_mini'
  };

  /**
   *  @description channelMappings只处理固定渠道来源，活动来源请使用其他方式处理，禁止在此mapping中添加
   */
  const channelMappings = [
    {
      key: '1047', //小程序码/物料码
      value: {
        registerChannel: 'channel_Materialscan',
        registerSubChannel: 'channel_Materialscan_01'
      }
    },
    {
      key: 'HTTP://CBG.PUB/Z1/', // 瓶盖码
      value: {
        registerChannel: 'channel_Capscan',
        registerSubChannel: 'channel_Capscan_01'
      }
    },
    {
      key: 'https://dlccopenapi.carlsberg.cn', // 瓶身码
      value: {
        registerChannel: 'channel_others',
        registerSubChannel: 'channel_other_cap'
      }
    },
    {
      key: ';frmopnid:', // 默认分享
      value: {
        registerChannel: 'channel_Share',
        registerSubChannel: ''
      }
    }
  ];
  const sceneString = String(scene);
  const q = decodeURIComponent(query.q || query.from || '');
  const matchedMapping = channelMappings.find((mapping) => {
    return mapping.key === sceneString || q.includes(mapping.key);
  });
  channel = matchedMapping ? matchedMapping.value : channel;
  withLogin(channel);
};
</script>
<style>
@import './wxcomponents/@vant/weapp/common/index.wxss';
@import '@/static/style/animate.min.css';
@import '@/static/style/common.scss';
</style>
