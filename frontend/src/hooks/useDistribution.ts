import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import type { DistributionResponse } from '../types/scores';

export function useDistribution() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DistributionResponse | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api.distribution());
    } catch (e) {
      setData(null);
      setError(
        e instanceof ApiError
          ? e.message
          : 'Không tải được báo cáo. Kiểm tra backend và dữ liệu seed.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { loading, error, data, refetch: fetchData };
}
