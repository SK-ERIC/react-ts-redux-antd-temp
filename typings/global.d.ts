/// <reference types="react-scripts" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'classnames' {
  import classNames from 'classnames';
  export default classNames;
}

interface ReduxProps {
  storeData?: Record<string, any>;
  setStoreData?: (type: string, payload: any) => object;
}

type RefType = MutableRefObject<unknown> | ((instance: unknown) => void);

type CommonObjectType<T = any> = Record<string, T>;

declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};
declare type Indexable<T = any> = {
  [key: string]: T;
};
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
declare type TimeoutHandle = ReturnType<typeof setTimeout>;
declare type IntervalHandle = ReturnType<typeof setInterval>;

declare interface ChangeEvent extends Event {
  target: HTMLInputElement;
}

declare interface WheelEvent {
  path?: EventTarget[];
}

declare function parseInt(s: string | number, radix?: number): number;

declare function parseFloat(string: string | number): number;
