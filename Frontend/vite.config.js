import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Fix import alias for ShadCN
    },
  },
  server: {
    proxy: {
      
      "/api/": "https://linkhub-70dv.onrender.com"
      
    },
  },
  
})

// "/api/": "http://localhost:3000"
