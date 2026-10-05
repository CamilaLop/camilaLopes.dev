import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import postcssConfig from './postcss.config.js';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const sourceEntry = fileURLToPath(new URL('./src/main.tsx', import.meta.url));

export default defineConfig(({ command, isPreview }) => {
  if (command === 'serve' && !isPreview && !existsSync(sourceEntry)) {
    throw new Error(`Arquivo de entrada ausente: ${sourceEntry}\nExtraia o ZIP completo. A pasta do projeto deve conter src, public, package.json e vite.config.ts juntos.`);
  }

  return {
    root: projectRoot,
    plugins: [react()],
    css: { postcss: postcssConfig },
    server: { host: '127.0.0.1', port: 5173, strictPort: true },
    preview: { host: '127.0.0.1', port: 4173, strictPort: true },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },
  };
});
