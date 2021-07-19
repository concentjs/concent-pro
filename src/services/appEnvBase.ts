///////////////////////////////////////////////////////////////////
//
// appPath 依赖 appEnv，appPath 和 appEnv 需共同依赖 isProdEnv，估独立一个
// 文件放此函数，避免循环依赖
//
///////////////////////////////////////////////////////////////////
import * as commonUtil from 'utils/common';


/**
 * 判断是否是生产环境
 */
export function isProdEnv() {
  if (commonUtil.isLocalMode()) return false;
  const { hostname } = window.location;
  if (hostname === 'xxx.yy.com') {
    return true;
  }
  return false;
}

let masterAppLoadedSetSignal: number = 0;
export function setMasterAppLoadedSignal() {
  window.__MASTER_APP_LOADED__ = true;
  masterAppLoadedSetSignal = 1;
}

/**
 * 是否是子应用
 * 子应用渲染时不渲染任何排版，仅挂载MainContent
 * @returns
 */
export function isSubApp() {
  // 本地开发时，强制设置当前应用作为子应用来加载
  if (process.env.REACT_APP_IS_SUB_APP === 'true') {
    return true;
  }
  // 被设置过了，当前应用一定是主应用，主应用不包含任何业务pages，全靠SubAppLoader加载各个子应用
  if (masterAppLoadedSetSignal !== 0) {
    return false;
  }
  // __MASTER_APP_LOADED__ 已被主应用设置为true了，当前站点一定是子应用
  if (window.__MASTER_APP_LOADED__ === true) {
    return true;
  }
  return false;
}
