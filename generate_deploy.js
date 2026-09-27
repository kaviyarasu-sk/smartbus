const fs = require('fs');
const path = require('path');

// Update frontend .env.production to use dynamic backend URL
const envProdPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/.env.production';
fs.writeFileSync(envProdPath, 'VITE_API_URL=https://smartbus-backend.onrender.com/api\n');

// Update AuthContext to use api service (already done but make sure)
// Update LiveTracking socket URL to use env variable
const trackingPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/pages/LiveTracking.jsx';
let trackingContent = fs.readFileSync(trackingPath, 'utf8');
trackingContent = trackingContent.replace(
  "const socket = io('http://localhost:5000');",
  "const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');"
);
fs.writeFileSync(trackingPath, trackingContent);

// Create vercel.json for SPA routing
const vercelConfig = {
  rewrites: [{ source: "/(.*)", destination: "/index.html" }]
};
fs.writeFileSync(
  'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/vercel.json',
  JSON.stringify(vercelConfig, null, 2)
);

// Create Procfile and render.yaml for backend
fs.writeFileSync(
  'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend/Procfile',
  'web: node server.js\n'
);

console.log('Deployment config files created!');
