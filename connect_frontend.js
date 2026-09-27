const fs = require('fs');
const path = require('path');

// 1. Create .env for frontend
const envPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend', '.env');
fs.writeFileSync(envPath, 'VITE_API_URL=http://localhost:5000/api\n');

// 2. Create api service
const apiServicePath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/services', 'api.js');
fs.mkdirSync(path.dirname(apiServicePath), { recursive: true });
const apiServiceContent = `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to automatically add the token
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
`;
fs.writeFileSync(apiServicePath, apiServiceContent);

// 3. Update AuthContext.jsx
const authContextPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/context', 'AuthContext.jsx');
let authContent = fs.readFileSync(authContextPath, 'utf8');
authContent = authContent.replace("import axios from 'axios';", "import api from '../services/api';");
authContent = authContent.replace("await axios.post('http://localhost:5000/api/auth/login', { email, password })", "await api.post('/auth/login', { email, password })");
authContent = authContent.replace("await axios.post('http://localhost:5000/api/auth/register', userData)", "await api.post('/auth/register', userData)");
fs.writeFileSync(authContextPath, authContent);

// 4. Update Buses.jsx
const busesPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/pages', 'Buses.jsx');
let busesContent = fs.readFileSync(busesPath, 'utf8');
busesContent = busesContent.replace("import axios from 'axios';", "import api from '../services/api';");
busesContent = busesContent.replace(/const \{ data \} = await axios\.get\('http:\/\/localhost:5000\/api\/buses', \{[^}]+\}\);/s, "const { data } = await api.get('/buses');");
fs.writeFileSync(busesPath, busesContent);

// 5. Update Routes.jsx
const routesPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/pages', 'Routes.jsx');
let routesContent = fs.readFileSync(routesPath, 'utf8');
routesContent = routesContent.replace("import axios from 'axios';", "import api from '../services/api';");
routesContent = routesContent.replace(/const \{ data \} = await axios\.get\('http:\/\/localhost:5000\/api\/routes', \{[^}]+\}\);/s, "const { data } = await api.get('/routes');");
fs.writeFileSync(routesPath, routesContent);

console.log("Frontend connected to backend successfully via Axios service!");
