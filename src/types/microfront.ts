export type RemoteKey = "catalog" | "agente";

export type Microfront = {
  id: string;
  name: string;
  description: string;
  remote: RemoteKey;
  module: string;
  accent: string;
};
