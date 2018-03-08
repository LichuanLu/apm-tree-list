import {EventEmitter} from 'fbemitter';

export interface TreeNodeProps {
  id: string;
  label: string;
  children: boolean | Array<string>;
  parent?: string;
  type?: string;
  status?: string;
  data?: any;
}

export interface TreeSelectorProps {
  style?: any;
  /** web only */
  prefixCls?: string;
  className?: string;
  current: TreeNodeProps;
  value?: Array<string>;
  onChange?: (value: Array<TreeNodeProps>) => void;
  storageKeyPrefix?: string;
  // TODO: should return es6 Promise
  fetchChildren?: (currentID: string) => any;
  multipleSelect?: boolean;
}

export interface TreeListProps extends TreeSelectorProps {
  initialListSize?: number;
  showSelect?: boolean;
  showDelay?: number;
}

export interface TreeSelectorItemProps {
  style?: any;
  /** web only */
  prefixCls?: string;
  className?: string;
  rowData: TreeNodeProps;
  emitter: EventEmitter;
  onChange?: (value: string) => void;
  showSelect?: boolean;
  toChildLevel?: () => void;
}
