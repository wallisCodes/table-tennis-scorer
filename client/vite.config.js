import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/table-tennis-scorer/', // change to tRacket
    build: {
        outDir: 'dist', // Outputs to client/dist
    }
})
