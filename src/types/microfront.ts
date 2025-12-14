// Tipado base para microfronts federados y sus claves.
export type RemoteKey = "catalog" | "agente" | "nfc" | "notificaciones";

export type Microfront = {
  id: string;
  name: string;
  description: string;
  remote: RemoteKey;
  module: string;
  accent: string;
};
