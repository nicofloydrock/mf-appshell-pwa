export type RemoteKey = "catalog" | "agente" | "nfc";

export type Microfront = {
  id: string;
  name: string;
  description: string;
  remote: RemoteKey;
  module: string;
  accent: string;
};
