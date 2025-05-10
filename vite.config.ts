import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //allow domain https://development.aprilio.dev/
  server: {
    allowedHosts: ['development.aprilio.dev'],
  }
});
