import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', 'lucide-react'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    }
  },
  root: "./client",
  publicDir: "public",
  base: "/",
  server: {
    port: 3000,
    host: true
  },
  define: {
    // Remove Replit-specific environment variables for Firebase
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
});