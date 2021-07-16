import { LS_C2PRO_SETTINGS, LS_C2PRO_SETTINGS_VER } from 'configs/constant/sys';
import { getBasename } from './appPath';
import * as appEnvBase from './appEnvBase';

/**
 * 判断是否是生产环境
 */
export function isProdEnv() {
  return appEnvBase.isProdEnv();
}

export function getC2ProSettingsKey() {
  const basename = getBasename();
  return basename ? `${LS_C2PRO_SETTINGS}.${basename}` : LS_C2PRO_SETTINGS;
}

export function getC2ProSettingsVerKey() {
  const basename = getBasename();
  return basename ? `${LS_C2PRO_SETTINGS_VER}.${basename}` : LS_C2PRO_SETTINGS_VER;
}

export function setMasterAppLoadedSignal() {
  appEnvBase.setMasterAppLoadedSignal();
}

/**
 * 是否是子应用
 * 子应用渲染时不渲染任何排版，仅挂载MainContent
 * @returns
 */
export function isSubApp() {
  return appEnvBase.isSubApp();
}
