import type { PluginOption } from "vite";
import federation from "@originjs/vite-plugin-federation";

type Env = Record<string, string>;

const ensureProtocol = (value?: string) => {
  if (!value) return value;
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
};

export function moduleFederationConfig(env: Env): PluginOption {
  const remotesHost = env.VITE_REMOTES_HOST ?? "http://localhost";

  const catalogPath = env.VITE_REMOTE_PATH_CATALOG ?? "assets/mfEntry.js";
  const agentPath = env.VITE_REMOTE_PATH_AGENT ?? "assets/mfEntry.js";
  const nfcPath = env.VITE_REMOTE_PATH_NFC ?? "assets/mfEntry.js";
  const notifPath = env.VITE_REMOTE_PATH_NOTIF ?? "assets/mfEntry.js";

  const catalogUrl = ensureProtocol(env.VITE_REMOTE_CATALOG_URL);
  const agentUrl = ensureProtocol(env.VITE_REMOTE_AGENT_URL);
  const nfcUrl = ensureProtocol(env.VITE_REMOTE_NFC_URL);
  const notifUrl = ensureProtocol(env.VITE_REMOTE_NOTIF_URL);

  const remoteUrl = (port: number, path: string) =>
    `${ensureProtocol(remotesHost)}:${port}/${path}`;

  return federation({
    name: "app-shell",
    remotes: {
      catalog: catalogUrl ?? remoteUrl(5001, catalogPath),
      agente: agentUrl ?? remoteUrl(5005, agentPath),
      nfc: nfcUrl ?? remoteUrl(5006, nfcPath),
      notificaciones: notifUrl ?? remoteUrl(5007, notifPath),
    },
    shared: {
      react: { singleton: true, eager: true, requiredVersion: "^18.2.0" },
      "react-dom": {
        singleton: true,
        eager: true,
        requiredVersion: "^18.2.0",
      },
    },
  });
}
