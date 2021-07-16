// +++ node modules +++
import React from 'react';
import { ConnectRouter } from 'react-router-concent';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
// +++ project modules +++
import { CtxDe } from 'types/store';
import { getBasename } from 'services/appPath';
import { isSubApp } from 'services/appEnv';
import { useC2DefaultMod } from 'services/concent';
// +++ local modules +++
import TopContent from './TopContent';
import MainContent from './MainContent';
import LeftContent from './LeftContent';
import Footer from './Footer';
import SettingDrawer from './components/SettingDrawer';
import WaterMark from './components/WaterMark';

function setup({ effect, globalReducer }: CtxDe) {
  effect(() => {
    globalReducer.loginByCookie();
  }, []);
}

/**
 * 带整个布局系统的主应用
 */
function App() {
  useC2DefaultMod({ setup, tag: 'App' });
  const RootRouter: any = window.location.hostname.includes('github.io') ? HashRouter : BrowserRouter;
  return (
    <RootRouter basename={`/${getBasename()}`}>
      <ConnectRouter callUrlChangedOnInit={true}>
        <ConfigProvider locale={zhCN}>
          <Layout>
            <WaterMark />
            <TopContent />
            <LeftContent />
            <MainContent />
            <Footer />
            <SettingDrawer />
          </Layout>
        </ConfigProvider>
      </ConnectRouter>
    </RootRouter>
  );
}

/**
 * 仅带主内容区的子应用
 */
function SubApp() {
  return (
    <ConfigProvider locale={zhCN}>
      <MainContent />
    </ConfigProvider>
  );
}

/**
 * 本地运行的仅带主内容区的子应用
 * 区别于 SubApp，LocalSubApp 配置了 setup，会触发 global 模块的登录流程，将登录返回数据写入 global 模块
 * 还包裹了 BrowserRouter 组件，用于响应路由系统
 */
function LocalSubApp() {
  useC2DefaultMod({ setup, tag: 'App' });
  return (
    <BrowserRouter basename={`/${getBasename()}`}>
      <ConnectRouter callUrlChangedOnInit={true}>
        <MainContent />
      </ConnectRouter>
    </BrowserRouter>
  );
}

export default React.memo(() => {
  if (isSubApp()) {
    if (process.env.REACT_APP_IS_LOCAL === 'true') return <LocalSubApp />;
    else return <SubApp />;
  }

  return <App />;
});

