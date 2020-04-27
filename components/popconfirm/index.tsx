import * as React from 'react';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import Tooltip, { AbstractTooltipProps } from '../tooltip';
import Button from '../button';
import { ButtonType, NativeButtonProps } from '../button/button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import { ConfigContext } from '../config-provider';
import { getRenderPropValue, RenderFunction } from '../_util/getRenderPropValue';

export interface PopconfirmProps extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction;
  disabled?: boolean;
  onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
  okText?: React.ReactNode;
  okType?: ButtonType;
  cancelText?: React.ReactNode;
  okButtonProps?: NativeButtonProps;
  cancelButtonProps?: NativeButtonProps;
  icon?: React.ReactNode;
  onVisibleChange?: (visible: boolean, e?: React.MouseEvent<HTMLElement>) => void;
}

export interface PopconfirmState {
  visible?: boolean;
}

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

const Popconfirm = React.forwardRef<unknown, PopconfirmProps>((props, ref) => {
  const [visible, setVisible] = React.useState(props.visible);

  React.useEffect(() => {
    if ('visible' in props) {
      setVisible(props.visible);
    }
  }, [props.visible]);

  React.useEffect(() => {
    if ('defaultVisible' in props) {
      setVisible(props.defaultVisible);
    }
  }, [props.defaultVisible]);

  const settingVisible = (value: boolean, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!('visible' in props)) {
      setVisible(value);
    }

    if (props.onVisibleChange) {
      props.onVisibleChange(value, e);
    }
  };

  const onConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    settingVisible(false, e);

    if (props.onConfirm) {
      props.onConfirm.call(this, e);
    }
  };

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    settingVisible(false, e);

    if (props.onCancel) {
      props.onCancel.call(this, e);
    }
  };

  const onVisibleChange = (value: boolean) => {
    const { disabled } = props;
    if (disabled) {
      return;
    }
    settingVisible(value);
  };

  const renderOverlay = (prefixCls: string, popconfirmLocale: PopconfirmLocale) => {
    const { okButtonProps, cancelButtonProps, title, cancelText, okText, okType, icon } = props;
    return (
      <div className={`${prefixCls}-inner-content`}>
        <div className={`${prefixCls}-message`}>
          {icon}
          <div className={`${prefixCls}-message-title`}>{getRenderPropValue(title)}</div>
        </div>
        <div className={`${prefixCls}-buttons`}>
          <Button onClick={onCancel} size="small" {...cancelButtonProps}>
            {cancelText || popconfirmLocale.cancelText}
          </Button>
          <Button onClick={onConfirm} type={okType} size="small" {...okButtonProps}>
            {okText || popconfirmLocale.okText}
          </Button>
        </div>
      </div>
    );
  };

  const { getPrefixCls } = React.useContext(ConfigContext);

  const { prefixCls: customizePrefixCls, placement, ...restProps } = props;
  const prefixCls = getPrefixCls('popover', customizePrefixCls);

  const overlay = (
    <LocaleReceiver componentName="Popconfirm" defaultLocale={defaultLocale.Popconfirm}>
      {(popconfirmLocale: PopconfirmLocale) => renderOverlay(prefixCls, popconfirmLocale)}
    </LocaleReceiver>
  );

  return (
    <Tooltip
      {...restProps}
      prefixCls={prefixCls}
      placement={placement}
      onVisibleChange={onVisibleChange}
      visible={visible}
      overlay={overlay}
      ref={ref as any}
    />
  );
});

Popconfirm.defaultProps = {
  transitionName: 'zoom-big',
  placement: 'top' as PopconfirmProps['placement'],
  trigger: 'click' as PopconfirmProps['trigger'],
  okType: 'primary' as PopconfirmProps['okType'],
  icon: <ExclamationCircleFilled />,
  disabled: false,
};

export default Popconfirm;