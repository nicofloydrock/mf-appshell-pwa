import microfrontContent from "../content/microfronts.json";
import type { Microfront, RemoteKey } from "../types/microfront";

// Mapping de remotos MF -> import dinámico.
export const remoteLoaders: Record<RemoteKey, () => Promise<unknown>> = {
  catalog: () => import("catalog/App"),
  agente: () => import("agente/App"),
  nfc: () => import("nfc/App"),
  notificaciones: () => import("notificaciones/App"),
};

// Catálogo de microfronts visibles en el menú.
export const microfronts: Microfront[] = microfrontContent;
