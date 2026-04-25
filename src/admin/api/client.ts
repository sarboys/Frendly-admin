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
): Promise<T> {
  const response = await fetch(`${adminApiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new AdminApiError(response.status, body.code, body.message);
  }

  return response.json() as Promise<T>;
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
