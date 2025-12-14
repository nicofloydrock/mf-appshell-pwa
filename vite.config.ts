// Configuración Vite del AppShell: React, Module Federation, PWA e HMR sync entre remotos.
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { listenForRemoteRebuilds } from "@antdevx/vite-plugin-hmr-sync";
import { moduleFederationConfig } from "./module.federation.config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedApps = ["catalog", "agente", "nfc", "notificaciones"];

  return {
    plugins: [
      react(),
      moduleFederationConfig(env, mode),
      // Escucha rebuilds de remotos y fuerza reload para mantener host sincronizado en dev.
      listenForRemoteRebuilds({
        allowedApps,
        endpoint: "/on-child-rebuild",
        hotPayload: { type: "full-reload", path: "*" },
        onRebuild: (app) => console.log(`[AppShell] reload triggered by ${app}`),
      }),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.ts",
        registerType: "autoUpdate",
        includeAssets: ["icons/pwa-192.png", "icons/pwa-512.png"],
        devOptions: {
          enabled: true, // SW en dev
        },
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
        },
        manifest: {
          name: "App Shell MF",
          short_name: "AppShell",
          description: "App shell para microfrontends React",
          start_url: "/",
          display: "standalone",
          background_color: "#020617",
          theme_color: "#0ea5e9",
          icons: [
            {
              src: "/icons/pwa-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/pwa-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    server: {
      port: 5173,
      host: "0.0.0.0",
      allowedHosts: true,
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["*"],
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    },
    preview: {
      port: 4173,
      host: "0.0.0.0",
      allowedHosts: ["mf-appshell-pwa-production.up.railway.app", ".railway.app"],
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["*"],
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    },
    build: {
      target: "esnext",
      modulePreload: false,
      minify: false,
      cssCodeSplit: false,
    },
  };
});
