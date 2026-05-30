import { useCallback, useState } from 'react';
import { api, ApiError } from '../api/client';
import type { ScoreRecord } from '../types/scores';

const SBD_PATTERN = /^\d{8}$/;

export function useScoreLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreRecord | null>(null);

  const search = useCallback(async (sbd: string) => {
    const trimmed = sbd.trim();
    if (!SBD_PATTERN.test(trimmed)) {
      setError('Số báo danh phải gồm đúng 8 chữ số');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.lookup(trimmed);
      setResult(data);
    } catch (e) {
      setResult(null);
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError('Không thể kết nối máy chủ. Kiểm tra backend đã chạy chưa.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { loading, error, result, search, reset };
}
