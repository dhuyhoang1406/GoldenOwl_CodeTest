const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (body.message) {
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message;
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

export const api = {
  lookup: (sbd: string) => request<import('../types/scores').ScoreRecord>(`/scores/lookup/${sbd}`),
  distribution: () =>
    request<import('../types/scores').DistributionResponse>('/scores/report/distribution'),
  topGroupA: (limit = 10) =>
    request<import('../types/scores').TopGroupAResponse>(
      `/scores/report/top-group-a?limit=${limit}`,
    ),
};
