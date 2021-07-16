import * as icons from '@ant-design/icons';
import React from 'react';
import { IMenuJsonItem, IMenuJsonGroup, IMenuItem, IMenuGroup } from './types';

type IconTypes = keyof typeof icons;

export default function convertToMenus(menusOfJsonFile: Array<IMenuJsonGroup | IMenuJsonItem>) {
  const menus: Array<IMenuItem | IMenuGroup> = [];

  menusOfJsonFile.forEach(item => {
    const menuJsonGroup = item as IMenuJsonGroup;
    if (menuJsonGroup.children) {
      const { children, key, label, iconName } = menuJsonGroup;
      const antIconName = iconName as IconTypes;
      const Icon = icons[antIconName] as React.SFC<{ style?: React.CSSProperties }>;
      const menuGroup: IMenuGroup = { key, label, Icon, children: [] };

      children.forEach((childItem) => {
        const { path, authId, componentPath, label, iconName, isHomePage, setContentLayout } = childItem;
        const antIconName = iconName as IconTypes;
        const Icon = icons[antIconName] as React.SFC<{ style?: React.CSSProperties }>;
        menuGroup.children.push({
          // todo, 接入模块联邦，远程加载此组件
          Component: React.lazy(() => import(componentPath)),
          path, authId, label: 'xxx', Icon,
        });
      });

      menus.push(menuGroup);
      return;
    }

    const menuJsonItem = item as IMenuJsonItem;
    const { path, authId, componentPath, label, iconName, isHomePage, setContentLayout } = menuJsonItem;
    const antIconName = iconName as IconTypes;;
    const Icon = icons[antIconName] as React.SFC<{ style?: React.CSSProperties }>;
    menus.push({
      // 远程加载此组件
      Component: React.lazy(() => import(componentPath)),
      path, authId, label, Icon, isHomePage, setContentLayout,
    });
  });

  return menus;
}
