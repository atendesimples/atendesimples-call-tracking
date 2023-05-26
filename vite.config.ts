import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
  },
  plugins: [tsconfigPaths()],
})
