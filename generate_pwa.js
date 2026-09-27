const fs = require('fs');
const path = require('path');

const frontendPublic = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/public';
const frontendSrc = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src';
const frontendRoot = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend';

// 1. Create manifest.json (this tells the phone it's an app)
const manifest = {
  name: "SmartBus - Bus Tracking System",
  short_name: "SmartBus",
  description: "Real-time bus tracking and smart transportation management",
  start_url: "/",
  display: "standalone",
  background_color: "#4338ca",
  theme_color: "#4338ca",
  orientation: "portrait",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
  ]
};
fs.mkdirSync(frontendPublic, { recursive: true });
fs.writeFileSync(path.join(frontendPublic, 'manifest.json'), JSON.stringify(manifest, null, 2));

// 2. Create a simple SVG icon and convert to a placeholder PNG reference
// We'll create an SVG that can be used as favicon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#4338ca">
  <rect width="512" height="512" rx="100" fill="#4338ca"/>
  <text x="256" y="340" font-size="280" font-family="Arial" fill="white" text-anchor="middle" font-weight="bold">🚌</text>
</svg>`;
fs.writeFileSync(path.join(frontendPublic, 'icon.svg'), svgIcon);

// 3. Create service worker for offline support
const sw = `const CACHE_NAME = 'smartbus-v1';
const urlsToCache = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
`;
fs.writeFileSync(path.join(frontendPublic, 'sw.js'), sw);

// 4. Update index.html with PWA meta tags
const indexPath = path.join(frontendRoot, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace head content to add PWA meta tags
if (!indexHtml.includes('manifest')) {
  indexHtml = indexHtml.replace('</head>', `    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#4338ca" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SmartBus" />
    <link rel="apple-touch-icon" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>`);
  fs.writeFileSync(indexPath, indexHtml);
}

// 5. Register service worker in main.jsx
const mainPath = path.join(frontendSrc, 'main.jsx');
let mainContent = fs.readFileSync(mainPath, 'utf8');
if (!mainContent.includes('serviceWorker')) {
  mainContent += `
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('SmartBus PWA ready!');
    });
  });
}
`;
  fs.writeFileSync(mainPath, mainContent);
}

// 6. Create PWA Install Prompt Component
const installPrompt = `import { useState, useEffect } from 'react';
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
`;
fs.mkdirSync(path.join(frontendSrc, 'components'), { recursive: true });
fs.writeFileSync(path.join(frontendSrc, 'components/InstallPrompt.jsx'), installPrompt);

// 7. Add InstallPrompt to App.jsx
const appPath = path.join(frontendSrc, 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');
if (!appContent.includes('InstallPrompt')) {
  appContent = appContent.replace(
    "import Profile from './pages/Profile';",
    "import Profile from './pages/Profile';\nimport InstallPrompt from './components/InstallPrompt';"
  );
  appContent = appContent.replace(
    '</Router>',
    '  <InstallPrompt />\n    </Router>'
  );
  fs.writeFileSync(appPath, appContent);
}

console.log('PWA setup complete! SmartBus is now installable as a mobile app!');
