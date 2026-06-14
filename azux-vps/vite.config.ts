// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// For Firebase Hosting: Build as SPA only (no SSR)
// To use SSR, deploy to Cloudflare Pages or use Firebase Cloud Functions
export default defineConfig({
  tanstackStart: {
    // Build client-only for Firebase static hosting
    ssr: false,
  },
  vite: {
    build: {
      // Output all files to dist root for Firebase Hosting
      outDir: 'dist',
      emptyOutDir: true,
    },
  },
});
