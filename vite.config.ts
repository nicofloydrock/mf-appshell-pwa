import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // 1. Definición de Hosts y Rutas
  const remotesHost = env.VITE_REMOTES_HOST ?? "http://192.168.1.8";
  
  // NOTA: Elimina 'dist/' de las rutas. El servidor ya apunta a la raíz de dist.
  // Asegúrate de que tus remotes generan el archivo con este nombre exacto.
  const catalogPath = env.VITE_REMOTE_PATH_CATALOG ?? "assets/mfEntry.js"; 
  const checkoutPath = env.VITE_REMOTE_PATH_CHECKOUT ?? "assets/remoteEntry.js";
  const analyticsPath = env.VITE_REMOTE_PATH_ANALYTICS ?? "assets/remoteEntry.js";
  const profilePath = env.VITE_REMOTE_PATH_PROFILE ?? "assets/remoteEntry.js";

  // Función helper para construir la URL completa
  const remoteUrl = (port: number, path: string) => `${remotesHost}:${port}/${path}`;

  return {
    plugins: [
      react(),
      federation({
        name: "app-shell",
        // El App Shell consume remotes, aquí se definen:
        remotes: {
          catalog: remoteUrl(5001, catalogPath),
          checkout: remoteUrl(5002, checkoutPath),
          analytics: remoteUrl(5003, analyticsPath),
          profile: remoteUrl(5004, profilePath),
        },
        shared: {
          react: { 
            singleton: true, 
            eager: true, // Importante para evitar flash de carga
            requiredVersion: "^18.2.0" 
          },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: "^18.2.0",
          },
        },
      }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/pwa-192.png", "icons/pwa-512.png"],
        devOptions: {
          enabled: true, // habilita SW en dev para probar instalación en localhost
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
    // Configuración del servidor local (Host)
    server: {
      port: 5173,
      host: "0.0.0.0",
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
    // 2. CONFIGURACIÓN CRÍTICA DEL BUILD
    build: {
      target: "esnext", // Necesario para top-level await
      modulePreload: false, // Desactiva preload para evitar errores de carga en federación
      minify: false, // Opcional: ponlo en true para prod, false ayuda a depurar
      cssCodeSplit: false, // Ayuda a cargar CSS de los remotes correctamente
    },
  };
});
