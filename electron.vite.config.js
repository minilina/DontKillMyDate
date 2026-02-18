import { defineConfig } from "electron-vite";
// import react from '@vitejs/plugin-react';
import { resolve } from 'path'
export default defineConfig({
    publicDir: false,
    main: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'main.js')
                }
            }
        }
    },
    preload: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'preload.js')
                }
            }
        }
    },
    renderer: {
        // plugins: [/* react() */],
        root: '.',
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'index.electron.html')
                }
            }
        }
    }
});