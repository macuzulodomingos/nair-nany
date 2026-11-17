// No navegador usa o proxy /api (mesmo domínio do site, o cookie funciona).
// No servidor (SSR) um caminho relativo não funciona, então vai direto ao backend.
export const API_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL ?? "http://localhost:3333"
    : "/api";