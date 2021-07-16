/**
 * 基座app才需要执行此逻辑，动态的确定边栏导航模样
 */
import { calcMenuData } from '../derived/menus';
import menus from '../menus';
// import { isSubApp } from 'services/appEnv';
// import convertToMenus from './convertToMenus';
// import menusConf from '../menusConf';


export default async function () {
  // todo for hub-app: fetch remote menu data
  // const rawMenuData = convertToMenus(menusConf.data);
  // calcMenuData(rawMenuData);

  // 如不需要此功能，加载本地配置的菜单即可
  calcMenuData(menus);
}
