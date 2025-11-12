declare module 'express' {
  const express: any;
  export default express;
  export const Router: any;
  export type Request = any;
  export type Response = any;
  export type NextFunction = any;
}

declare module 'express-serve-static-core';
declare module 'body-parser';
declare module 'connect';
declare module 'http-errors';
declare module 'mime';
declare module 'qs';
declare module 'range-parser';
declare module 'send';
declare module 'serve-static';

declare module 'node:path' {
  const path: any;
  export = path;
}

declare module 'node:async_hooks' {
  export class AsyncLocalStorage<T> {
    run(store: T, callback: (...args: any[]) => void): void;
    getStore(): T | undefined;
  }
}

declare const process: any;
