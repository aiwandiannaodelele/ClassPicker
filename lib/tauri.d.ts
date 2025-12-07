// lib/tauri.d.ts

interface TauriWindow {
  setTitle(title: string): Promise<void>;
  minimize(): Promise<void>;
  destroy(): Promise<void>;
  close(): Promise<void>;
  getCurrentWindow(): TauriWindow;
}

declare global {
  interface Window {
    __TAURI__?: {
      window: {
        getCurrentWindow: () => TauriWindow;
      };
    };
  }
}

export {};
