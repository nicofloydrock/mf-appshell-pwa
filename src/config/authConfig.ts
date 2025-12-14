import type { AuthContext } from "../types/auth";

export function buildAuthContext(token: string, user: { id: string; name: string }): AuthContext {
  const now = Date.now();
  return {
    provider: "auth0-demo",
    tokenType: "Bearer",
    accessToken: token,
    idToken: `dummy-id-token-${token}`,
    expiresAt: new Date(now + 60 * 60 * 1000).toISOString(),
    roles: ["admin", "viewer"],
    permissions: {
      catalog: ["metrics:read", "inventory:read"],
      agente: ["chat:read", "chat:send"],
      nfc: ["nfc:read"],
      notificaciones: ["push:read", "push:send"],
    },
    user: {
      ...user,
      email: "operator.demo@cmpc.test",
      avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    organizations: [{ id: "org-cmpc-demo", name: "CMPC Demo Org" }],
    metadata: {
      tenant: "default-tenant",
      scopes: ["openid", "profile", "email"],
      audience: "cmpc-mf",
    },
  };
}
