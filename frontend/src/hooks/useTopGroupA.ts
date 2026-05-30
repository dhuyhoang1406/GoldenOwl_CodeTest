import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import type { TopGroupAResponse } from '../types/scores';

export function useTopGroupA(limit = 10) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TopGroupAResponse | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api.topGroupA(limit));
    } catch (e) {
      setData(null);
      setError(
        e instanceof ApiError
          ? e.message
          : 'Không tải được danh sách top khối A.',
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { loading, error, data, refetch: fetchData };
}
