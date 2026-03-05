import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, X, Phone, MessageCircle } from 'lucide-react';

export const VoiceAIOrb = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    const checkWidgetState = () => {
      const agentTalking = document.querySelector('.wcw-agent-talking');
      const userTalking = document.querySelector('.wcw-user-talking');
      const rippleContainer = document.querySelector('.ripple-container');
      const loading = document.querySelector('.wcw-loading');

      const isVisible = (el: Element | null) => el && window.getComputedStyle(el).display !== 'none';
      const callActive = isVisible(agentTalking) || isVisible(userTalking) || isVisible(rippleContainer) || isVisible(loading);

      setIsCallActive(!!callActive);
      if (callActive && isConnecting) setIsConnecting(false);
    };

    checkWidgetState();
    const interval = setInterval(checkWidgetState, 500);
    return () => clearInterval(interval);
  }, [isConnecting]);

  return (
    <>
      {/* Floating Orb */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-orb-primary flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 ${isCallActive ? 'ring-4 ring-primary/50 ring-offset-2' : ''}`}
        animate={isExpanded ? { scale: 0.9 } : { scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI assistant"
      >
        <span className={`absolute inset-0 rounded-full bg-orb-primary ${isCallActive ? 'animate-ping' : 'animate-orb-ripple'}`} />
        <span className="absolute inset-0 rounded-full bg-orb-primary animate-orb-ripple" style={{ animationDelay: '0.5s' }} />
        <span className="absolute inset-0 rounded-full bg-orb-primary animate-orb-ripple" style={{ animationDelay: '1s' }} />

        {isCallActive && (
          <motion.span
            className="absolute inset-[-8px] rounded-full border-4 border-accent"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="relative z-10">
          {isExpanded ? <X className="w-7 h-7 text-primary-foreground" /> : <Mic className={`w-7 h-7 text-primary-foreground ${isCallActive ? 'animate-pulse' : ''}`} />}
        </motion.div>
      </motion.button>

      {/* Panel */}
      <motion.div
        initial="closed"
        animate={isExpanded ? "open" : "closed"}
        variants={{
          open: { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" as const, display: "block" },
          closed: { opacity: 0, y: 20, scale: 0.9, pointerEvents: "none" as const, transitionEnd: { display: "none" } },
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 right-6 z-50 w-80 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
      >
        <div className="bg-primary p-5 text-primary-foreground">
          <h3 className="font-serif text-xl font-semibold mb-1">Hi, I&apos;m Tom! 🌿</h3>
          <p className="text-sm text-primary-foreground/80">
            Rob&apos;s AI assistant. Ask me about services, pricing or book a quote.
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Voice AI */}
          <button
            onClick={() => {
              setIsConnecting(true);
              const widget = document.querySelector('.wcw-state-container') as HTMLElement;
              if (widget) {
                widget.click();
                setTimeout(() => setIsConnecting(false), 5000);
              }
            }}
            className={`w-full p-4 rounded-xl flex items-center gap-4 text-foreground transition-all text-left relative overflow-hidden ${
              isCallActive ? 'bg-accent/20 ring-2 ring-accent/70'
              : isConnecting ? 'bg-primary/10 ring-2 ring-primary/50 animate-pulse'
              : 'bg-primary/5 hover:bg-primary/10'
            }`}
          >
            {isConnecting && (
              <motion.div className="absolute inset-0 border-2 border-primary rounded-xl" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
            )}
            {isCallActive && (
              <motion.div className="absolute inset-0 border-2 border-accent rounded-xl" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
            )}
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
              {isCallActive ? (
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                  <Mic className="w-6 h-6 text-accent" />
                </motion.div>
              ) : isConnecting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Mic className="w-6 h-6 text-primary" />
                </motion.div>
              ) : (
                <Mic className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="relative z-10">
              <p className="font-medium">{isCallActive ? 'Call in progress' : isConnecting ? 'Connecting...' : 'Talk to me now'}</p>
              <p className="text-sm text-muted-foreground">{isCallActive ? 'Tap to end call' : isConnecting ? 'Please wait' : 'Voice assistant'}</p>
            </div>
          </button>

          {/* Hidden widget */}
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true" style={{ width: 0, height: 0, overflow: 'hidden' }}>
            <div data-widget-key="e56e8963-7795-401e-893f-81dc59768f80" />
          </div>

          {/* Phone */}
          <a href="tel:+61468170318" className="w-full p-4 rounded-xl flex items-center gap-4 bg-primary/5 hover:bg-primary/10 text-foreground transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Call us directly</p>
              <p className="text-sm text-muted-foreground">0468 170 318</p>
            </div>
          </a>

          {/* SMS */}
          <a href="sms:+61468170318" className="w-full p-4 rounded-xl flex items-center gap-4 bg-primary/5 hover:bg-primary/10 text-foreground transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Send a Text</p>
              <p className="text-sm text-muted-foreground">Quick SMS message</p>
            </div>
          </a>
        </div>

        <div className="px-5 pb-5">
          <p className="text-xs text-center text-muted-foreground">Available 24/7 • Powered by AI</p>
        </div>
      </motion.div>
    </>
  );
};
