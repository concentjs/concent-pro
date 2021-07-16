import { createFromIconfontCN } from '@ant-design/icons';
import React from 'react';

const commonIcons: {
  MyIcon: React.SFC<React.PropsWithChildren<{ type: string, style?: React.CSSProperties }>>
} = {
  MyIcon: () => <h1>未调用 loadIconByUrl 进行初始化</h1>,
};

const stHotEventForMenu = { fontSize: '22px', transform: 'translate(-5px, 3px)', marginRight: '0px' };
const customizedIcons = {
  HotEvent: () => <icons.MyIcon type="iconxxx" />,
  HotEventForMenu: () => <icons.MyIcon style={stHotEventForMenu} type="iconxxx" />,
};

export const icons = {
  ...commonIcons,
  ...customizedIcons,
};

export function loadIconByUrl(url: string) {
  icons.MyIcon = createFromIconfontCN({
    // 在 iconfont.cn 上生成，可拷贝上传到自己维护的 cdn 上
    // scriptUrl: '//at.alicdn.com/t/font_1239425_qzdgyf4x6j.js',
    scriptUrl: url,
  });
}

export default icons;
