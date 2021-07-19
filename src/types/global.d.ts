
/**
 * 声明window里用户新增的属性，让ts编译通过
 */

declare global {
  interface Window {
    /** 是否已加载了主应用, 谁先加载水就有机会写他 */
    __MASTER_APP_LOADED__: boolean;
    [key: string]: any;
  }
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export { };
