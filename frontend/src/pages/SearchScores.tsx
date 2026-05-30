import { useState, type FormEvent } from 'react';
import { Card } from '../components/Card';
import { ScoreTable } from '../components/ScoreTable';
import { useScoreLookup } from '../hooks/useScoreLookup';

export function SearchScores() {
  const [sbd, setSbd] = useState('');
  const { loading, error, result, search } = useScoreLookup();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void search(sbd);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tra cứu điểm</h1>
        <p className="mt-1 text-slate-600">Nhập số báo danh để xem điểm chi tiết</p>
      </div>

      <Card title="Tra cứu theo số báo danh">
        <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="sbd" className="mb-1.5 block text-sm font-medium text-slate-700">
              Số báo danh
            </label>
            <input
              id="sbd"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="VD: 01000001"
              value={sbd}
              onChange={(e) => setSbd(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm outline-none ring-brand-500 focus:border-brand-500 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Đang tra...' : 'Tra cứu'}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </Card>

      {result && (
        <Card title="Điểm chi tiết" description={`SBD: ${result.sbd}`}>
          <ScoreTable score={result} />
        </Card>
      )}

      {!result && !error && !loading && (
        <Card title="Kết quả">
          <p className="text-sm text-slate-500">
            Nhập số báo danh và bấm Tra cứu để xem điểm từng môn.
          </p>
        </Card>
      )}
    </div>
  );
}
