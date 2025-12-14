# AppShell MF – Host para Microfrontends (React + Vite)

AppShell minimalista que orquesta microfrontends federados (Catálogo, Agente, NFC, Notificaciones), con PWA, sincronización HMR entre remotos y textos centralizados en JSON. Pensado como arquetipo escalable para escenarios empresariales (roles/permisos dummy listos para Auth0/MSAL).

## Stack
- React 18 + TypeScript
- Vite 5
- Module Federation (`@originjs/vite-plugin-federation`)
- HMR sync multi-app (`@antdevx/vite-plugin-hmr-sync`)
- TailwindCSS 3
- PWA (`vite-plugin-pwa`, injectManifest)

## Estructura relevante
- `src/content/`: textos y catálogo de microfronts en JSON (sin hardcode en componentes).
  - `shell.json`: header, hero, guías, banner PWA, copys de notificación.
  - `microfronts.json`: lista de remotos (id, descripción, accents).
- `src/components/shell/`: piezas atómicas (<70 líneas) para header, menú, hero, preview, guía y banner PWA.
- `src/constants/microfronts.ts`: carga `microfronts.json` y define loaders dinámicos.
- `src/config/appConfig.ts`: objeto `AppConfig` con token demo + `auth` dummy (roles/permisos estilo Auth0/MSAL) y método `notify`.
- `src/config/authConfig.ts`: builder del contexto de auth/roles/permissions dummy.
- `src/hooks/`: `usePwaUpdate`, `useNotifications`.
- `module.federation.config.ts`: rutas de remotos (usa `mfEntry.js` en dev, `assets/mfEntry.js` en build) y remapping por env.
- `vite.config.ts`: Vite + React, Module Federation, PWA y listener HMR sync (`listenForRemoteRebuilds`).

## Variables y remotos
- Por defecto el host busca remotos en:
  - Dev: `http://localhost:5001/5005/5006/5007/mfEntry.js`
  - Build/preview: `http://<host>:<port>/assets/mfEntry.js`
- Overridables con env:
  - `VITE_REMOTES_HOST`, `VITE_REMOTE_*_URL` (catalog/agent/nfc/notif), `VITE_REMOTE_PATH_*`.

## Scripts
- `npm run dev` → Vite dev server (puerto 5173, HMR sync activo).
- `npm run build` → build de producción + SW injectManifest.
- `npm run preview` / `npm run start` → preview de build (puerto 4173 por defecto).

## Cómo levantar en dev (host + remotos)
1) AppShell: `cd mf-appshell-pwa && npm install && npm run dev`.
2) Remotos:
   - Catálogo: `cd mf-catalog-pwa && npm install && npm run dev -- --port 5001`
   - Agente: `cd mf-agents-pwa && npm install && npm run dev -- --port 5005`
   - NFC: `cd mf-nfc-web-pwa && npm install && npm run dev -- --port 5006`
   - Notificaciones: `cd mf-notificaciones-pwa && npm install && npm run dev -- --port 5007`
3) Abrir `http://localhost:5173/?remote=catalog` y probar montaje.
4) Cambia código en un remoto: `notifyOnRebuild` pinguea `/on-child-rebuild` y el host recarga (ver log `[AppShell] reload triggered by <app>`).

## PWA
- Config injectManifest en `vite.config.ts` (skipWaiting + clientsClaim).
- CTA “Refrescar PWA” dispara `usePwaUpdate().refresh()` y refresca con cache-bust.
- Banner PWA usa copys de `shell.json`.

## Auth/roles dummy
- `AppConfig` expone `auth` con roles/permissions/orgs estilo Auth0/MSAL (demo, sin backend). Se pasa como `config` a los remotos para que validen permisos o muestren user.

## Textos centralizados
- Edita `src/content/shell.json` para cambiar títulos, CTAs, guías, copys de notificación y banner PWA.
- Edita `src/content/microfronts.json` para agregar/quitar remotos o actualizar descripciones/colores.

## Notas
- Componentes del shell mantienen límite <70 líneas para escalabilidad.
- Si cambias puertos/host, ajusta `hostUrl` en los `notifyOnRebuild` de cada remoto o usa `VITE_REMOTES_HOST`.
