import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email offline_access',
  },
  routes: {
    callback: '/auth/callback',
    login: '/login',
    postLogoutRedirect: 'http://localhost:3000',
  },
};