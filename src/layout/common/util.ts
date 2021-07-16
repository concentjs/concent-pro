
const subAppContentLayout: React.CSSProperties = { marginLeft: '0', paddingTop: '0', minHeight: '100%', overflowX: 'auto' };

/** 因为 contentLayout 取的是基座global里的值，所以不能去global computed里判断isHub 返回固定的layout */
export function getSubAppContentLayout(): React.CSSProperties {
  return subAppContentLayout;
}
