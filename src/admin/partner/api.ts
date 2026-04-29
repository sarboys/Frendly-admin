const DEFAULT_API_BASE_URL = "http://localhost:3000";
const PARTNER_TOKENS_KEY = "frendly.partner.tokens";
let memoryTokens: string | null = null;

export const partnerApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE_URL;

export type PartnerTokens = {
  accessToken: string;
  refreshToken: string;
};

export type PartnerAccount = {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected" | "suspended" | string;
  partnerId: string | null;
  organizationName: string;
  taxId: string;
  city: string;
  contactName: string;
  phone: string;
  role: string;
  reviewNote: string | null;
};

export type PartnerAuthResponse = {
  account: PartnerAccount;
  tokens?: PartnerTokens;
};

export class PartnerApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "PartnerApiError";
  }
}

export async function partnerApiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const tokens = getPartnerTokens();
  const authHeader = tokens?.accessToken
    ? { Authorization: `Bearer ${tokens.accessToken}` }
    : {};
  const response = await fetch(`${partnerApiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new PartnerApiError(response.status, body.code, body.message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export function registerPartner(input: Record<string, unknown>) {
  return partnerApiRequest<PartnerAuthResponse>("/partner/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginPartner(input: { email: string; password: string }) {
  const response = await partnerApiRequest<PartnerAuthResponse>("/partner/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (response.tokens) {
    setPartnerTokens(response.tokens);
  }
  return response;
}

export function getPartnerMe() {
  return partnerApiRequest<PartnerAuthResponse>("/partner/me");
}

export async function logoutPartner() {
  const tokens = getPartnerTokens();
  clearPartnerTokens();
  if (!tokens) {
    return;
  }
  await partnerApiRequest<{ ok: true }>("/partner/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  }).catch(() => null);
}

export function setPartnerTokens(tokens: PartnerTokens) {
  writeTokenStorage(JSON.stringify(tokens));
}

export function getPartnerTokens(): PartnerTokens | null {
  const raw = readTokenStorage();
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PartnerTokens>;
    if (
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string"
    ) {
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      };
    }
  } catch {
    clearPartnerTokens();
  }

  return null;
}

export function clearPartnerTokens() {
  removeTokenStorage();
}

function readTokenStorage() {
  if (typeof window.localStorage?.getItem === "function") {
    return window.localStorage.getItem(PARTNER_TOKENS_KEY);
  }
  return memoryTokens;
}

function writeTokenStorage(value: string) {
  if (typeof window.localStorage?.setItem === "function") {
    window.localStorage.setItem(PARTNER_TOKENS_KEY, value);
    return;
  }
  memoryTokens = value;
}

function removeTokenStorage() {
  if (typeof window.localStorage?.removeItem === "function") {
    window.localStorage.removeItem(PARTNER_TOKENS_KEY);
  }
  memoryTokens = null;
}

async function readErrorBody(response: Response) {
  try {
    const body = (await response.json()) as { code?: unknown; message?: unknown };
    return {
      code: typeof body.code === "string" ? body.code : "partner_api_error",
      message: typeof body.message === "string" ? body.message : "Partner API request failed",
    };
  } catch {
    return {
      code: "partner_api_error",
      message: "Partner API request failed",
    };
  }
}
