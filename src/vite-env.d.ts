/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_API_KEY: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_ADMIN_CALENDAR_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    gapi: any;
}

declare const __APP_SEMVER__: string;
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
