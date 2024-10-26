import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    // root: 'client',
    // root: 'C:/Users/Josh/Documents/Coding/Portfolio Projects/table-tennis-scorer/client/public',
    plugins: [react()],
    base: '/table-tennis-scorer/',
})
