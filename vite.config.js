import { defineConfig } from 'vite';

import path from 'path';



export default defineConfig({
    build: { chunkSizeWarningLimit: 5000 },
    base:  path.basename(__dirname)
});
