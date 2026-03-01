/// <reference types="vite/client" />

/* Vue 3 Single-File Components type declarations */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

/* Environment declarations */
interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* WebUI bridge declarations for Rust backend integration */
interface Window {
  __webui__?: {
    call: (action: string, data: string) => Promise<string>;
    bind: (event: string, callback: (response: string) => void) => void;
  };
  __WS_PORT__?: number;
  __EARLY_ERRORS__?: Array<{
    msg: string;
    url: string;
    line: number;
    col: number;
    error: string;
    time: number;
  }>;
  WinBox: any;
  getUsers?: () => void;
  getDbStats?: () => void;
  refreshUsers?: () => void;
  searchUsers?: () => void;
  logger?: {
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
  };
  Logger?: {
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
  };
}

/* Custom event declarations */
declare global {
  interface WindowEventMap {
    'db_response': CustomEvent<{ success: boolean; data?: unknown; error?: string }>;
    'stats_response': CustomEvent<{ success: boolean; stats?: unknown }>;
    'window_state_response': CustomEvent<unknown>;
    'window_history_response': CustomEvent<unknown>;
    'port_info_response': CustomEvent<unknown>;
    'sysinfo_response': CustomEvent<unknown>;
    'backend_pong': CustomEvent<unknown>;
  }
}

export {};
