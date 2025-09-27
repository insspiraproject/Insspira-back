import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

const backendBaseURL = process.env.NODE_ENV === 'production' 
  ? 'https://api-latest-ejkf.onrender.com'
  : 'http://localhost:3000';

  const frontendRedirect = process.env.NODE_ENV === 'production' 
  ? 'https://insspira-front-git-vercel-insspiras-projects-818b6651.vercel.app'
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
    scope: 'openid profile email',
    //audience: process.env.AUTH0_AUDIENCE,
  },
  routes: {
    callback: '/auth/callback',
    login: '/login',
    postLogoutRedirect: frontendRedirect,
  },
};

console.log('🔍 Auth0 Config:');
console.log('🌐 Backend URL:', backendBaseURL);
console.log('🔗 Callback URL:', `${backendBaseURL}/auth/callback`);
console.log('🔗 Post Logout Redirect:', frontendRedirect);