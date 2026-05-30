import { Card } from '../components/Card';
import { DistributionChart } from '../components/DistributionChart';
import { useDistribution } from '../hooks/useDistribution';
import { useTopGroupA } from '../hooks/useTopGroupA';
import { SCORE_LEVEL_LABELS, type ScoreLevelKey } from '../types/scores';

const LEVEL_KEYS: ScoreLevelKey[] = ['gte8', 'gte6_lt8', 'gte4_lt6', 'lt4'];

export function Reports() {
  const distribution = useDistribution();
  const topA = useTopGroupA(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Báo cáo</h1>
        <p className="mt-1 text-slate-600">
          Thống kê phân bố điểm và top thí sinh khối A
        </p>
      </div>

      <Card
        title="Phân bố điểm theo môn"
        description="Số thí sinh theo 4 mức: ≥ 8 , 6– Dưới 8 , 4– Dưới 6 ,  <4"
      >
        {distribution.loading && (
          <p className="py-12 text-center text-slate-500">Đang tải dữ liệu...</p>
        )}
        {distribution.error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {distribution.error}
          </p>
        )}
        {distribution.data && (
          <>
            <DistributionChart data={distribution.data} />
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
              {LEVEL_KEYS.map((key) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor:
                        key === 'gte8'
                          ? '#2563eb'
                          : key === 'gte6_lt8'
                            ? '#0d9488'
                            : key === 'gte4_lt6'
                              ? '#f59e0b'
                              : '#ef4444',
                    }}
                  />
                  {SCORE_LEVEL_LABELS[key]}
                </span>
              ))}
            </div>
          </>
        )}
      </Card>

      <div id="top-a">
        <Card
          title="Top 10 khối A"
          description="Toán + Vật lí + Hóa học (tổng điểm cao nhất)"
        >
          {topA.loading && (
            <p className="py-8 text-center text-slate-500">Đang tải...</p>
          )}
          {topA.error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {topA.error}
            </p>
          )}
          {topA.data && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">SBD</th>
                    <th className="px-3 py-2 font-medium">Toán</th>
                    <th className="px-3 py-2 font-medium">Vật lí</th>
                    <th className="px-3 py-2 font-medium">Hóa</th>
                    <th className="px-3 py-2 font-medium">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {topA.data.students.map((student, index) => (
                    <tr
                      key={student.sbd}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2.5 font-medium text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-brand-800">
                        {student.sbd}
                      </td>
                      <td className="px-3 py-2.5">{student.toan.toFixed(2)}</td>
                      <td className="px-3 py-2.5">{student.vat_li.toFixed(2)}</td>
                      <td className="px-3 py-2.5">{student.hoa_hoc.toFixed(2)}</td>
                      <td className="px-3 py-2.5 font-bold text-brand-700">
                        {student.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
