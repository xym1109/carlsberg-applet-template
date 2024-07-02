import sentry from './sentry-mina';
const AppEnv = uni.getAccountInfoSync().miniProgram.envVersion;

export const initSentry = () => {
  if (AppEnv !== 'release') return;
  // config Sentry
  sentry.init({
    dsn: 'https://ed6d077b79d248cda39f02ecf413d8e4@sentry.chiefclouds.com/51'
  });

  // Add a breadcrumb for future events
  sentry.addBreadcrumb({
    message: 'My Breadcrumb'
  });

  // Capture exceptions, messages or manual events
  // sentry.captureMessage('Hello, world!');
  // sentry.captureException(new Error('Good bye'));
  // sentry.captureEvent({
  //   message: 'Manual',
  //   stacktrace: [
  //   ],
  // });

  new sentry.Integrations.Breadcrumbs({
    console: true,
    realtimeLog: ['info', 'warn', 'error'], // https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/
    request: true,
    navigation: true,
    api: true,
    lifecycle: true,
    unhandleError: true
  });

  new sentry.Integrations.TryCatch();
  new sentry.Integrations.LogManager({
    level: 0
  });
  new sentry.Integrations.GlobalHandlers();
  sentry.init({
    transportOptions: {
      retry: 2
    }
  });
};

/***
 * 上传错误信息
 */
export const sendSentryError = (errLevel, requestData, url, userInfo, error, defaultHeader) => {
  if (AppEnv !== 'release') return;
  sentry.configureScope((scope) => {
    // 日志级别error、warn、info
    scope.setLevel(errLevel);
    // 设置api报错tag
    scope.setTag('fun', 'API-Error');
    // 请求数据
    scope.setExtra('request-data', requestData);
    // 请求url
    scope.setExtra('request-url', url);
    // 用户信息
    scope.setExtra('userInfo', userInfo);
    // 错误信息
    scope.setExtra('error-info', error);
    // 请求header参数
    scope.setExtra('defaultHeader', defaultHeader);
  });
  // 抓取错误信息
  sentry.captureMessage(`url: ${url},${error.msg || error.errMsg || error.message}`);
};
