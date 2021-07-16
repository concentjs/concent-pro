import React from 'react';
// import SiderSwitchIcon from 'components/dumb/SiderSwitchIcon';
import { useC2DefaultMod } from 'services/concent';
import { isSubApp } from 'services/appEnv';
import Sider from './components/Sider';

function LeftContent() {
  const { globalReducer, globalComputed: gcu } = useC2DefaultMod();
  if (isSubApp()) return <span style={{ display: 'none' }} />;

  return (
    <React.Fragment>
      {/* <SiderSwitchIcon des={gcu.siderInfo.iconDes} onClick={globalReducer.toggleSiderVisible} /> */}
      <Sider />
    </React.Fragment>
  );
}

export default React.memo(LeftContent);
