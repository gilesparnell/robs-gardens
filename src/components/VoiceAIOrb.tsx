import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Phone, MessageCircle } from 'lucide-react';

export const VoiceAIOrb = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 z-50 w-80 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-5 text-primary-foreground">
              <h3 className="font-serif text-xl font-semibold mb-1">Hi, I'm Rosie! 🌿</h3>
              <p className="text-sm text-primary-foreground/80">
                Your Rob Gardens AI assistant. How can I help you today?
              </p>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Voice AI Option */}
              <motion.button
                onClick={handleCallClick}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
                  isListening 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-primary/5 hover:bg-primary/10 text-foreground'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isListening ? 'bg-accent-foreground/20 animate-orb-pulse' : 'bg-primary/10'
                }`}>
                  <Mic className={`w-6 h-6 ${isListening ? 'text-accent-foreground' : 'text-primary'}`} />
                </div>
                <div className="text-left">
                  <p className="font-medium">
                    {isListening ? 'Listening...' : 'Talk to Rosie'}
                  </p>
                  <p className="text-sm opacity-70">
                    {isListening ? 'Click to stop' : 'Voice assistant'}
                  </p>
                </div>
              </motion.button>

              {/* Phone Option */}
              <a
                href="tel:+61400000000"
                className="w-full p-4 rounded-xl flex items-center gap-4 bg-primary/5 hover:bg-primary/10 text-foreground transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-muted-foreground">0400 000 000</p>
                </div>
              </a>

              {/* SMS Option */}
              <a
                href="sms:+61400000000"
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
        )}
      </AnimatePresence>
    </>
  );
};
