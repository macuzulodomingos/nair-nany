// Fallback para localhost caso você esqueça de configurar o .env
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";