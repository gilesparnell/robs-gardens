/**
 * GoHighLevel (GHL) Chat Widget global API
 */
declare global {
  interface Window {
    __GHLC__?: {
      openChat?: () => void;
      closeChat?: () => void;
      toggleChat?: () => void;
      [key: string]: any;
    };
  }
}

export {};
