
async function main() {
  // 启动 concent
  await import('./configs/runConcent');

  // 初始化 icon 资源
  const { loadIconByUrl } = await import('./components/dumb/icons');
  loadIconByUrl('https://at.alicdn.com/t/font_1239425_qzdgyf4x6j.js'); // 可提前远程拉取后再调用 loadIconByUrl

  // 准备菜单数据
  const prepareMenuDataMod = await import('./configs/remoteMenus/prepareMenuData');
  prepareMenuDataMod.default();

  await import('./loadApp');
}

main().catch(err => {
  console.error(err);
  alert(err.message)
});

// avoid isolatedModules warning
export { };
