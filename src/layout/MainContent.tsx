import React from 'react';
import { Layout } from 'antd';
import { useC2DefaultMod } from 'services/concent';
import { isSubApp } from 'services/appEnv';
import { getSubAppContentLayout } from './common/util';
import Routes from './components/Routes';
import SkeletonScreen from './components/SkeletonScreen';

function MainContent() {
  const { globalState, globalComputed } = useC2DefaultMod();
  const { contentLayoutStyle } = globalComputed;
  let targetLayout = contentLayoutStyle;
  if (isSubApp()) targetLayout = getSubAppContentLayout();

  if (!globalState.isAppReady) {
    return <Layout style={targetLayout}>
      <SkeletonScreen />
    </Layout>;
  }

  // 异步的路由组件在组件还未拉取到时，会撑不起内容区高度，这里包一个div给一个minHeight解决此问题
  return <div style={{ minHeight: targetLayout.minHeight }}><Routes /></div>;
}

export default React.memo(MainContent);
