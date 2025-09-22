import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

const backendBaseURL = process.env.NODE_ENV === 'production' 
  ? 'https://api-latest-ejkf.onrender.com'
  : 'http://localhost:3001';

export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: backendBaseURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email offline_access',
    audience: process.env.AUTH0_AUDIENCE,
  },
  routes: {
    callback: '/auth/callback',
    login: '/login',
    postLogoutRedirect: backendBaseURL,
  },
};

console.log('🔍 EOIDC Backend Config:');
console.log('🌐 Backend URL:', backendBaseURL);
console.log('🔗 Callback URL:', `${backendBaseURL}/auth/callback`);