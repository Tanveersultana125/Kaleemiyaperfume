import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineMessage = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#310101] text-white py-2 px-4 flex items-center justify-center gap-2 z-[9999] shadow-lg animate-in fade-in slide-in-from-top-full duration-300">
      <WifiOff size={16} className="text-[#B0843D]" />
      <span className="text-sm font-medium">You are currently offline. Some features may be limited.</span>
    </div>
  );
};

export default OfflineMessage;
