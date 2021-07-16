
/**
 * 由 configs/menus 派生出的数据
 */
import { IMenuGroup, IMenuItem } from '../menus';

// 打平菜单为一层的结构
function flatMenus(menus: Array<IMenuItem | IMenuGroup>) {
  const flatted = [] as IMenuItem[];

  const pushToFlatted = (item: IMenuItem) => {
    flatted.push(item);
  };

  menus.forEach((item) => {
    const groupItem = item as IMenuGroup;
    if (groupItem.children) {
      groupItem.children.forEach(pushToFlatted);
      return;
    }
    const menuItem = item as IMenuItem;
    pushToFlatted(menuItem);
  });

  return flatted;
}

// 提前计算好 menus 的相关映射关系，或者其他目标参数，以及填充true默认值(方便其他地方使用时能够拥有正确的默认值)
function calcMenus(menus: Array<IMenuItem | IMenuGroup>) {
  let homePageFullPath = '';

  menus.forEach((item) => {
    const groupItem = item as IMenuGroup;
    if (groupItem.children) {
      const { children, ...rest } = groupItem;
      const showingMenuGroup: IMenuGroup = { ...rest, children: [] };
      const allMenuGroup: IMenuGroup = { ...rest, children: [] };

      children.forEach((childItem) => {
        const { path, showInSider = true, setContentLayout = true, exact = true, ...rest } = childItem;
        const fillDefaultValChildItem = { ...rest, exact, path, showInSider, setContentLayout };
        allMenuGroup.children.push(fillDefaultValChildItem);

        path2menuGroup[path] = allMenuGroup;
        path2menuItem[path] = fillDefaultValChildItem;
        if (childItem.isHomePage) {
          homePageFullPath = path;
          path2menuGroup['/'] = groupItem;
          path2menuItem['/'] = fillDefaultValChildItem;
        }
        if (showInSider) {
          showingMenuGroup.children.push(fillDefaultValChildItem);
        }
      });
      showingMenus.push(showingMenuGroup);
      allMenus.push(allMenuGroup);
      return;
    }

    const menuItem = item as IMenuItem;
    const { path, isHomePage, showInSider = true, setContentLayout = true, exact = true, ...rest } = menuItem;
    const fillDefaultValMenuItem = { ...rest, exact, path, isHomePage, showInSider, setContentLayout };
    allMenus.push(fillDefaultValMenuItem);
    path2menuItem[path] = fillDefaultValMenuItem;
    if (isHomePage) {
      path2menuItem['/'] = fillDefaultValMenuItem;
      homePageFullPath = path;
    }
    if (showInSider) {
      showingMenus.push(fillDefaultValMenuItem);
    }
  });
  return { path2menuGroup, path2menuItem, homePageFullPath, showingMenus, allMenus };
}

let homePageFullPath = '';
let path2menuItem: Record<string, IMenuItem> = {};
let path2menuGroup: Record<string, IMenuGroup> = {};
// 保持层级结构的可展现的菜单，翻遍垂直或水平模式下不用判断showInSider条件，直接渲染
// 因为水平下判断 showInSider 为false，返回无效节点会导致antd菜单组件报错
let showingMenus: Array<IMenuItem | IMenuGroup> = [];
let allMenus: Array<IMenuItem | IMenuGroup> = [];
/** 打平后的菜单，方便构造路由组件 */
let flattedMenus: Array<IMenuItem> = [];

export function calcMenuData(menus: Array<IMenuItem | IMenuGroup>) {
  const ret = calcMenus(menus);
  path2menuItem = ret.path2menuItem;
  path2menuGroup = ret.path2menuGroup;
  showingMenus = ret.showingMenus;
  allMenus = ret.allMenus;
  homePageFullPath = ret.homePageFullPath;
  flattedMenus = flatMenus(allMenus);
}

export function getMenuData() {
  return {
    path2menuGroup,
    path2menuItem,
    homePageFullPath,
    /** 辅助Sider组件，构造带层级关系的可展示菜单视图，注(指向的item数据也已经正确了填充了true默认值) */
    showingMenus,
    /** 所有的菜单，已正确填充了默认布尔值true的各个数据节点 */
    allMenus,
    flattedMenus,
  };
}
