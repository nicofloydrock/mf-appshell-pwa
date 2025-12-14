// Helpers para normalizar URLs/remotos y exponerlas tipadas al host.
type RemoteConfig = {
  catalog: string;
  agente: string;
};

const normalize = (value?: string) =>
  value?.replace(/\/+$/, "") ?? "";

const host = normalize(import.meta.env.VITE_REMOTES_HOST) || "http://localhost";

const catalogPath =
  import.meta.env.VITE_REMOTE_PATH_CATALOG ?? "assets/mfEntry.js";
const agentPath =
  import.meta.env.VITE_REMOTE_PATH_AGENT ?? "assets/mfEntry.js";

const catalogUrl =
  normalize(import.meta.env.VITE_REMOTE_CATALOG_URL) ||
  `${host}:5001/${catalogPath}`;
const agentUrl =
  normalize(import.meta.env.VITE_REMOTE_AGENT_URL) ||
  `${host}:5005/${agentPath}`;

export const remotesConfig: RemoteConfig = {
  catalog: catalogUrl,
  agente: agentUrl,
};
