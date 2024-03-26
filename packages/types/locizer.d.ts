declare module 'locizer' {
  export interface Locizer {
    init(config: any): Locizer;
    getLanguages(callback: (err: any, lngs: string[]) => void): void;
    load(
      namespace: string,
      language: string,
      callback: (err: any, data: any, lng: string | undefined) => void,
    ): void;
  }

  // This is a special export statement for a value that is a Locizer
  const locizer: Locizer;
  export default locizer;
}
