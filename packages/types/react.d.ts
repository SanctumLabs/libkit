import * as React from 'react';

declare module 'react' {
  // This override is necessary to avoid this TypeScript error:
  // "JSX element type '...' does not have any construct or call signatures"
  // eslint-disable-next-line @typescript-eslint/ban-types
  function isValidElement(object: {} | null | undefined): object is React.ReactElement;
}
