import type { ScoreRecord } from '../types/scores';
import { SUBJECT_DISPLAY } from '../types/scores';

interface ScoreTableProps {
  score: ScoreRecord;
}

function formatScore(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toFixed(2);
}

export function ScoreTable({ score }: ScoreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2 pr-4 font-medium">Môn</th>
            <th className="py-2 font-medium">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECT_DISPLAY.map(({ key, label }) => (
            <tr key={key} className="border-b border-slate-50">
              <td className="py-2.5 pr-4 text-slate-700">{label}</td>
              <td className="py-2.5 font-semibold text-brand-700">
                {formatScore(score[key] as number | null)}
              </td>
            </tr>
          ))}
          {score.ma_ngoai_ngu && (
            <tr>
              <td className="py-2.5 pr-4 text-slate-700">Mã ngoại ngữ</td>
              <td className="py-2.5 font-medium">{score.ma_ngoai_ngu}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
