import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Phone, MessageCircle } from 'lucide-react';

export const VoiceAIOrb = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCallClick = () => {
    // In production, this would initiate a voice AI call
    setIsListening(!isListening);
  };

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-orb-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        animate={isExpanded ? { scale: 0.9 } : { scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI assistant"
      >
        {/* Ripple animations */}
        <span className="absolute inset-0 rounded-full bg-orb-primary animate-orb-ripple" />
        <span className="absolute inset-0 rounded-full bg-orb-primary animate-orb-ripple" style={{ animationDelay: '0.5s' }} />
        <span className="absolute inset-0 rounded-full bg-orb-primary animate-orb-ripple" style={{ animationDelay: '1s' }} />

        {/* Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isExpanded ? (
            <X className="w-7 h-7 text-primary-foreground" />
          ) : (
            <Mic className="w-7 h-7 text-primary-foreground" />
          )}
        </motion.div>
      </motion.button>

      {/* Expanded Panel - Always rendered but hidden when closed to keep widget state */}
      <motion.div
        initial="closed"
        animate={isExpanded ? "open" : "closed"}
        variants={{
          open: {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            display: "block"
          },
          closed: {
            opacity: 0,
            y: 20,
            scale: 0.9,
            pointerEvents: "none",
            transitionEnd: {
              display: "none"
            }
          }
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 right-6 z-50 w-80 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary p-5 text-primary-foreground">
          <h3 className="font-serif text-xl font-semibold mb-1">Hi, I'm Tom! 🌿</h3>
          <p className="text-sm text-primary-foreground/80">
            I'm Rob's AI Virtual Assistant. How can I help you today?
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Voice AI Option - Custom Trigger */}
          <button
            onClick={() => {
              setIsConnecting(true);
              const widget = document.querySelector('.wcw-state-container') as HTMLElement;
              if (widget) {
                widget.click();
                // Reset connecting state after 5 seconds (fallback)
                setTimeout(() => setIsConnecting(false), 5000);
              }
            }}
            className={`w-full p-4 rounded-xl flex items-center gap-4 text-foreground transition-all text-left relative overflow-hidden ${isConnecting
                ? 'bg-primary/10 ring-2 ring-primary/50 animate-pulse'
                : 'bg-primary/5 hover:bg-primary/10'
              }`}
          >
            {/* Pulsing border effect when connecting */}
            {isConnecting && (
              <motion.div
                className="absolute inset-0 border-2 border-primary rounded-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
              {isConnecting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Mic className="w-6 h-6 text-primary" />
                </motion.div>
              ) : (
                <Mic className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="relative z-10">
              <p className="font-medium">
                {isConnecting ? 'Connecting...' : 'Talk to me now'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isConnecting ? 'Please wait' : 'Voice assistant'}
              </p>
            </div>
          </button>

          {/* Hidden Widget Container - kept in DOM for script to initialize */}
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true" style={{ width: 0, height: 0, overflow: 'hidden' }}>
            <div
              data-widget-key="e56e8963-7795-401e-893f-81dc59768f80"
            >
              {/* The script will inject the widget here. */}
            </div>
          </div>

          {/* Phone Option */}
          <a
            href="tel:+61415840985"
            className="w-full p-4 rounded-xl flex items-center gap-4 bg-primary/5 hover:bg-primary/10 text-foreground transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Try me on 0415 840 985</p>
              <p className="text-sm text-muted-foreground">0415 840 985</p>
            </div>
          </a>

          {/* SMS Option */}
          <a
            href="sms:+61415840985"
            className="w-full p-4 rounded-xl flex items-center gap-4 bg-primary/5 hover:bg-primary/10 text-foreground transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Send SMS</p>
              <p className="text-sm text-muted-foreground">Quick text message</p>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <p className="text-xs text-center text-muted-foreground">
            Available 24/7 • Powered by AI
          </p>
        </div>
      </motion.div>
    </>
  );
};
