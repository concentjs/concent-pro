/* eslint-disable react/no-children-prop */
/**
 * 根据 configs/menus 配置组装整个应用的路由系统
 */
import React, { Suspense } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { register, cst } from 'concent';
import { useSetup } from 'services/concent';
import { isSubApp } from 'services/appEnv';
import { getUrlChangedEvName } from 'react-router-concent';
import { Layout } from 'antd';
import { getMenuData } from 'configs/derived/menus';
import { IMenuItem } from 'configs/menus';
import Error403 from 'components/dumb/Error403';
import Error404 from 'components/dumb/Error404';
import * as typeUtil from 'utils/type';
import { decideVal } from 'utils/obj';
import { CtxDe } from 'types/store';
import SkeletonScreen from './SkeletonScreen';
import { getSubAppContentLayout } from '../common/util';
import styles from '../styles/App.module.css';

const { Content } = Layout;
export const evNames = {
  refreshRouterGuard: 'refreshRouterGuard',
};

let key = 0;
function setup(ctx: CtxDe) {
  key = key + 1;
  const ins = ctx.initState({
    key,
  });
  ctx.on(evNames.refreshRouterGuard, () => {
    key = key + 1;
    ins.setState({ key });
  });
  return {
    state: ins.state,
  };
}

/**
 * menu 里配置的路由组件透传的props类型
 */
export interface IMenuRouterCompProps {
  extraData?: Record<string, any>;
  routerProps: RouteComponentProps;
}
interface IRouterGuardProps extends IMenuRouterCompProps {
  Comp: React.ComponentType<any>;
}
const RouterGuard = React.memo((props: IRouterGuardProps) => {
  const settings = useSetup(setup);
  const passProps = { ...props.routerProps, extraData: props.extraData || {} };
  return <props.Comp key={settings.state.key} {...passProps} />;
});

class Routes extends React.Component {
  public ctx = typeUtil.typeVal<CtxDe>({});
  public errOccurred = false;

  public state: { err: string } = { err: '' };

  // 构建一次后就缓存路由组件，否则会在边栏收起时造成页面组件卸载并再挂载
  public cachedUi: Record<string, any> = { uiRoutes: null, uiHomeRoute: null, uiNotFound: null };
  public cachedUiCompWrapContent: Record<string, { ui: any, layoutStyle: any }> = {};

  public $$setup() {
    this.ctx.on(getUrlChangedEvName(), (param, action, history) => {
      console.log(param, action, history);
      if (this.errOccurred) {
        this.errOccurred = false;
        this.setState({ err: '' });
      }
    });
  }

  public componentDidCatch(err: any) {
    this.errOccurred = true;
    this.setState({ err: err.message });
  }

  // 提示当前路由页崩溃
  public renderCrashTip = () => {
    return (
      <Layout style={this.ctx.globalComputed.contentLayoutStyle}>
        <h1 style={{ color: 'red', padding: '64px' }}>
          当前路由页面崩溃，请联系 xxx 开发者 做进一步跟踪，如果是开发者，可打开console查看具体错误,
          如想继续访问当前页面，可刷新浏览器重试。
        </h1>
      </Layout>
    );
  }

  public getRealLayoutStyle = (): React.CSSProperties => {
    const { contentLayoutStyle } = this.ctx.globalComputed;
    if (isSubApp()) return getSubAppContentLayout();
    return contentLayoutStyle;
  }

  public renderChildrenWithContentWrap(children: React.ReactNode) {
    const contentLayoutStyle = this.getRealLayoutStyle();
    return <Layout style={contentLayoutStyle}>
      <Layout style={{ padding: '24px' }}>
        <Content className={styles.contentWrap}>
          {children}
        </Content>
      </Layout>
    </Layout>;
  }

  public renderChildrenWithNoContentWrap(children: React.ReactNode) {
    const contentLayoutStyle = this.getRealLayoutStyle();
    return <Layout style={contentLayoutStyle}>
      {children}
    </Layout>;
  }

  public renderChildren = (item: IMenuItem, props: RouteComponentProps, inputSetContentLayout?: boolean) => {
    console.warn('Render CompWrap');
    const setContentLayout = decideVal(inputSetContentLayout, item.setContentLayout);
    const contentLayoutStyle = this.getRealLayoutStyle();

    // check auth
    // if (item.authId && !this.ctx.globalState.authIds.includes(item.authId)) {
    //   return this.renderChildrenWithContentWrap(<Error403 />);
    // }
    // todo 这里待优化，暂时适配 tags系统
    if (item.authId && !this.ctx.globalState.authIds.some(it => {
      if (Array.isArray(item.authId)) return item.authId?.includes(it);
      // @ts-ignore
      return item.authId === it;
    })) {
      return this.renderChildrenWithContentWrap(<Error403 />);
    }


    // beforeComponentMount 可能返回一个替换的视图
    let uiReplaceRouteComp: React.ReactNode | void = '';
    const executed = React.useRef(false);
    if (!executed.current) {
      executed.current = true;
      if (item.beforeComponentMount) {
        uiReplaceRouteComp = item.beforeComponentMount(props);
      }
    }

    const ret = this.cachedUiCompWrapContent[item.path] || {};
    let { ui: uiCompWrapContent } = ret;
    const { layoutStyle } = ret;
    // layout 没变才返回缓存
    if (uiCompWrapContent && layoutStyle === contentLayoutStyle) return uiCompWrapContent;

    const uiTargetComp = uiReplaceRouteComp || <RouterGuard Comp={item.Component} routerProps={props} extraData={item.extraData} />;
    if (setContentLayout) {
      uiCompWrapContent = this.renderChildrenWithContentWrap(uiTargetComp);
    } else {
      uiCompWrapContent = this.renderChildrenWithNoContentWrap(uiTargetComp);
    }

    this.cachedUiCompWrapContent[item.path] = { ui: uiCompWrapContent, layoutStyle: contentLayoutStyle };
    return uiCompWrapContent;
  }

  // 创建一个渲染包含有【路由组件】的组件
  public makeCompWrap = (item: IMenuItem, setContentLayout?: boolean) => {
    return (props: RouteComponentProps) => {
      return this.renderChildren(item, props, setContentLayout);
    };
  }

  // 根据配置构造路由
  public buildRouteUi = () => {
    if (this.cachedUi.uiRoutes) return this.cachedUi;

    let homeMenuItem: IMenuItem | null = null;
    const { flattedMenus } = getMenuData();
    const uiRoutes = flattedMenus.map((item) => {
      if (item.isHomePage) homeMenuItem = item;
      const CompWrap = this.makeCompWrap(item);
      // todo: keepalive
      return <Route key={item.path} exact={item.exact} path={item.path} component={CompWrap} />;
      // return <Route key={item.path} exact={item.exact} path={item.path}
      //   children={(props: RouteComponentProps) => this.renderChildren(item, props)}
      // />;
    });

    let uiHomeRoute: React.ReactNode = '';
    if (homeMenuItem) {
      // let item = homeMenuItem;
      const CompWrap = this.makeCompWrap(homeMenuItem);
      uiHomeRoute = <Route exact={true} path={'/'} component={CompWrap} />;
      // uiHomeRoute = <Route exact={true} path={'/'} children={(props: RouteComponentProps) => this.renderChildren(item, props)} />;
    }

    // 第二位参数传递 true， 让404 页面包裹一下 content layout
    const CompNotFoundWrap = this.makeCompWrap({ Component: Error404, path: '', label: '' }, true);
    const uiNotFoundRoute = <Route component={CompNotFoundWrap} />;

    this.cachedUi = { uiRoutes, uiHomeRoute, uiNotFoundRoute };
    return this.cachedUi;
  }

  public render() {
    if (this.errOccurred) {
      return this.renderCrashTip();
    }
    const { uiRoutes, uiHomeRoute, uiNotFoundRoute } = this.buildRouteUi();
    return (
      <Suspense fallback={<SkeletonScreen label="页面加载中..." />}>
        <Switch>
          {uiRoutes}
          {uiHomeRoute}
          {uiNotFoundRoute}
        </Switch>
      </Suspense>
    );
  }
}

export default register(cst.MODULE_DEFAULT)(Routes);
