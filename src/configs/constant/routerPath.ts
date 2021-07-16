import { getBasename } from 'services/appPath';
import * as commonUtil from 'utils/common';

const pathName = (path: string) => {
  // 本地加载时，根节点会挂载 RootRouter，无需拼接 basename 前缀
  if (commonUtil.isLocalMode()) {
    return path;
  }
  return `/${getBasename()}${path}`;
};

export const DEMO = pathName('/demo');

export const DEMO_USE_SETUP = pathName('/demo-use-setup');

export const SIMPLE_LIST = pathName('/simple-list');

export const STEP_FORM = pathName('/step-form');
