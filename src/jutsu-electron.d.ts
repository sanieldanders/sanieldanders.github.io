declare global {
  interface Window {
    jutsuElectron?: {
      readonly isElectron: true;
      load(): Promise<unknown>;
      save(data: unknown): Promise<boolean>;
    };
  }
}

export {};
