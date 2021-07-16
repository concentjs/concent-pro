import React from 'react';
import { useC2DefaultMod } from 'services/concent';
import { SiderLogoTypes, SiderViewTypes } from 'configs/constant/sys';
import styles from '../styles/App.module.css';

function Logo() {
  const { globalComputed: { logoCtrl }, globalState } = useC2DefaultMod();
  const style: React.CSSProperties = { backgroundImage: `url(${logoCtrl.imgUrl})`, width: logoCtrl.width };

  if (globalState.siderLogoType === SiderLogoTypes.IMG) {
    if (logoCtrl.showLabel) {
      return <div className={styles.logoLabelWrap} style={{ color: logoCtrl.color }}>
        {logoCtrl.label}
      </div>;
    }

    return <div style={style} className={styles.logoWrapOfCollapsed} />;
  }

  if (globalState.siderViewType === SiderViewTypes.COLLAPSED) {
    return <div style={style} className={styles.logoImgWrapOfImgLabelMode} />;
  }

  style.width = logoCtrl.shortWidth;
  style.display = 'inline-block';
  const labelStyle: React.CSSProperties = { width: `calc(100% - ${style.width})` };
  return <div className={styles.logoBoxWrapOfImgLabelMode} >
    <div style={style} className={styles.logoImgWrapOfImgLabelMode} />
    <div style={labelStyle} className={styles.logoLabelOfImgLabelMode}>{logoCtrl.label}</div>
  </div>;
}

export default React.memo(Logo);
