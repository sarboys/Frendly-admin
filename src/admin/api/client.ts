const DEFAULT_API_BASE_URL = "http://localhost:3000";

export const adminApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE_URL;

export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

export async function adminApiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { skipRefresh?: boolean } = {},
): Promise<T> {
  const response = await fetch(`${adminApiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (response.status === 401 && !options.skipRefresh) {
    const refreshed = await refreshAdminSession();
    if (refreshed) {
      return adminApiRequest<T>(path, init, { skipRefresh: true });
    }
  }

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new AdminApiError(response.status, body.code, body.message);
  }

  return response.json() as Promise<T>;
}

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  role: "owner" | "operator" | "analyst";
};

export function loginAdmin(input: { email: string; password: string }) {
  return adminApiRequest<{ admin: AdminUser }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  }, { skipRefresh: true });
}

export function getAdminMe() {
  return adminApiRequest<{ admin: AdminUser }>("/admin/auth/me");
}

export function logoutAdmin() {
  return adminApiRequest<{ ok: boolean }>("/admin/auth/logout", {
    method: "POST",
  }, { skipRefresh: true });
}

async function refreshAdminSession() {
  const response = await fetch(`${adminApiBaseUrl}/admin/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.ok;
}

async function readErrorBody(response: Response) {
  try {
    const body = (await response.json()) as { code?: unknown; message?: unknown };
    return {
      code: typeof body.code === "string" ? body.code : "admin_api_error",
      message: typeof body.message === "string" ? body.message : "Admin API request failed",
    };
  } catch {
    return {
      code: "admin_api_error",
      message: "Admin API request failed",
    };
  }
}
