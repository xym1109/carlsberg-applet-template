const AppEnv = uni.getAccountInfoSync().miniProgram.envVersion;
const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
export const wxLog = {
  debug(...args: any[]) {
    if (!log) return;
    log.debug(...args);
  },
  info(...args: any[]) {
    if (!log) return;
    // let args = Array.prototype.slice.call(arguments);
    args.unshift(`【${AppEnv}】`);
    // log.info.apply(log, args);
    log.info(...args);
  },
  warn(...args: any[]) {
    if (!log) return;
    args.unshift(`【${AppEnv}】`);
    log.warn(...args);
  },
  error(...args: any[]) {
    if (!log) return;
    args.unshift(`【${AppEnv}】`);
    log.error(...args);
  },
  setFilterMsg(msg: string) {
    if (!log || !log.setFilterMsg) return;
    if (typeof msg !== 'string') return;
    log.setFilterMsg(msg);
  },
  addFilterMsg(...args: any[]) {
    if (!log || !log.addFilterMsg) return;

    args.unshift(`【${AppEnv}】`);
    log.addFilterMsg(...args);
  }
};
