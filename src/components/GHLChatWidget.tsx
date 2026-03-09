import { useEffect, useState } from 'react';

/**
 * GHLChatWidget - Official GHL Chat Widget
 *
 * Uses GHL's standard widget implementation instead of custom DOM scraping.
 * The widget is loaded once and manages its own UI, voice calls, and chat.
 *
 * No custom voice/chat logic needed - GHL handles everything.
 */

const GHL_WIDGET_ID = '69aa7bee4d840e5ae8d1ca7c';
const GHL_WIDGET_URL = 'https://widgets.leadconnectorhq.com/loader.js';
const GHL_RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

export const GHLChatWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector(`script[data-widget-id="${GHL_WIDGET_ID}"]`)) {
      console.log('[GHL Widget] Script already loaded');
      setIsLoaded(true);
      return;
    }

    console.log('[GHL Widget] Loading official GHL widget script...');

    try {
      const script = document.createElement('script');
      script.src = GHL_WIDGET_URL;
      script.async = true;
      script.setAttribute('data-resources-url', GHL_RESOURCES_URL);
      script.setAttribute('data-widget-id', GHL_WIDGET_ID);

      script.onload = () => {
        console.log('[GHL Widget] ✓ Script loaded successfully');
        setIsLoaded(true);
        setError(null);
      };

      script.onerror = () => {
        console.error('[GHL Widget] ✗ Failed to load widget script');
        setError('Failed to load chat widget. Please refresh the page.');
      };

      document.head.appendChild(script);
    } catch (err) {
      console.error('[GHL Widget] Error appending script:', err);
      setError('Error initializing chat widget.');
    }

    // Cleanup: Don't remove script on unmount since widget may be in use
    return () => {
      // Script stays loaded for subsequent visits
    };
  }, []);

  if (error) {
    return (
      <div className="fixed bottom-6 right-6 w-80 bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg shadow-lg z-50">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  return null; // Widget is rendered directly by GHL script
};
