/*
|--------------------------------------------------------------------------
| 快速设置入口Icon
|--------------------------------------------------------------------------
*/
import React from 'react';
import { Popover, Radio, RadioChangeEvent } from 'antd';
import { SkinOutlined } from '@ant-design/icons';
import { useC2DefaultMod } from 'services/concent';
import { CtxDe } from 'types/store';
import { SiteColorTypes } from 'configs/constant/sys';
import { VerticalBlank } from 'components/dumb/general';
import BaseIcon, { BaseIconMode } from './common/BaseIcon';

interface IProps {
  mode?: BaseIconMode,
}

const colorTypeOptions = [
  { label: '正常', value: SiteColorTypes.NORMAL },
  { label: '黑白', value: SiteColorTypes.GREY },
  { label: '暗夜', value: SiteColorTypes.DARK },
];
const allowWaterOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];

function setup(ctx: CtxDe) {
  const ins = ctx.initState({
    visible: false,
  });
  return {
    insState: ins.state,
    handleVisibleChange(visible: boolean) {
      ins.setState({ visible });
    },
    changeSiteColorType(e: RadioChangeEvent) {
      ctx.gr.setState({ siteColorType: e.target.value });
    },
    changeAllowWaterMark(e: RadioChangeEvent) {
      ctx.gr.setState({ allowWaterMark: e.target.value });
    },
  };
}

function SiteColorIcon(props: IProps) {
  const { mode = 'body' } = props;
  const { globalState, settings: se } = useC2DefaultMod({ setup });
  const passProps = { mode, Icon: SkinOutlined };

  const uiContent = <div>
    <div>站点色调：</div>
    <Radio.Group
      options={colorTypeOptions}
      onChange={se.changeSiteColorType}
      value={globalState.siteColorType}
      optionType="button"
      buttonStyle="solid"
    />
    <VerticalBlank />
    <div>开启水印：</div>
    <Radio.Group
      options={allowWaterOptions}
      onChange={se.changeAllowWaterMark}
      value={globalState.allowWaterMark}
      optionType="button"
      buttonStyle="solid"
    />
  </div>;

  return <Popover
    placement="bottomLeft"
    content={uiContent}
    title="快速设置"
    trigger="click"
    visible={se.insState.visible}
    onVisibleChange={se.handleVisibleChange}
  >
    <BaseIcon {...passProps} />
  </Popover>;
}

export default React.memo(SiteColorIcon);
