import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-indigo-700 text-white p-4 flex items-center justify-between z-50 shadow-lg">
      <div className="flex items-center gap-3">
        <Download size={24} />
        <div>
          <p className="font-bold">Install SmartBus App</p>
          <p className="text-sm text-indigo-200">Add to home screen for quick access</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleInstall} className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100 transition">
          Install
        </button>
        <button onClick={() => setShowBanner(false)} className="p-2 hover:bg-indigo-600 rounded-lg transition">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
