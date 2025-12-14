// Contrato mínimo que reciben los remotos desde el host para token/user/notify.
export type HostConfig = {
  token: string;
  user?: { id: string; name: string };
  notify?: (message: string) => Promise<void> | void;
};
