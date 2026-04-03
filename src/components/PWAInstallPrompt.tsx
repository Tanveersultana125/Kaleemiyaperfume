import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the default browser prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom UI
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-[#310101] text-[#FDFCFB] p-5 rounded-2xl shadow-2xl border border-white/10 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="bg-[#B0843D] p-3 rounded-xl shadow-inner">
          <Download className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg leading-tight mb-1">Install Kaleemiya App</h3>
          <p className="text-white/70 text-sm mb-4">
            Add to your home screen for a premium, fast, and offline-capable shopping experience.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-[#B0843D] hover:bg-[#8d6a31] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all active:scale-95 shadow-lg shadow-black/20"
            >
              Install Now
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
