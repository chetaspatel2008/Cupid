import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleSendOtpRequest, handleVerifyOtpRequest } from './server/smsService.js';

function smsBackendPlugin() {
  return {
    name: 'sms-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          handleSendOtpRequest(req, res);
        } else if (req.url === '/api/verify-otp' && req.method === 'POST') {
          handleVerifyOtpRequest(req, res);
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), smsBackendPlugin()],
});

