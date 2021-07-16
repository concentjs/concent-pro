import cc, { run, configure, Plugin } from 'concent';
import { isSubApp, setMasterAppLoadedSignal } from 'services/appEnv';
import reduxDevToolPlugin from 'concent-plugin-redux-devtool';
import * as msgService from 'services/message';
import * as commonUtil from 'utils/common';
import * as models from '../models';

// @ts-ignore
if (window.__MASTER_APP_LOADED__ === undefined) {
  setMasterAppLoadedSignal();
}

const plugins: Plugin[] = [];
// 建议生产环境关闭redux-dev-tool
if (commonUtil.isLocalMode()) {
  plugins.push(reduxDevToolPlugin);
}


// 是子应用且非本地开发调试模式，仅载入业务model即可
// 当前子应用和基座应用共享global模块
if (isSubApp() && process.env.REACT_APP_IS_LOCAL !== 'true') {
  const { $$global, ...rest } = models;
  configure(rest as any, { allowDup: true });
} else {
  run(models, {
    errorHandler: (err) => {
      msgService.error(err.message);
    },
    plugins,
    middlewares: [(midCtx, next) => {
      console.warn(midCtx);
      next();
    }],
    alwaysRenderCaller: true,
    isStrict: true,
  });
  cc.bindCcToWindow('');
};
