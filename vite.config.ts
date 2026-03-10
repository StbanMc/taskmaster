import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type PluginOption } from "vite";
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = process.env.PROJECT_ROOT || __dirname;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@phosphor-icons/react',
      'sonner',
      'framer-motion',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities'
    ],
    exclude: ['@github/spark']
  },
  server: {
    fs: {
      strict: false
    }
  }
});
