import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DistributionResponse } from '../types/scores';
import {
  SCORE_LEVEL_COLORS,
  SCORE_LEVEL_LABELS,
  type ScoreLevelKey,
} from '../types/scores';

const LEVEL_KEYS: ScoreLevelKey[] = ['gte8', 'gte6_lt8', 'gte4_lt6', 'lt4'];

interface DistributionChartProps {
  data: DistributionResponse;
}

export function DistributionChart({ data }: DistributionChartProps) {
  const chartData = Object.entries(data.subjects).map(([key, subject]) => ({
    key,
    name: subject.label,
    ...subject.levels,
  }));

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontFamily: 'Rubik, sans-serif',
            }}
            formatter={(value, name) => [
              Number(value).toLocaleString('vi-VN'),
              SCORE_LEVEL_LABELS[name as ScoreLevelKey] ?? String(name),
            ]}
          />
          <Legend
            formatter={(value) =>
              SCORE_LEVEL_LABELS[value as ScoreLevelKey] ?? value
            }
          />
          {LEVEL_KEYS.map((level) => (
            <Bar
              key={level}
              dataKey={level}
              stackId="a"
              fill={SCORE_LEVEL_COLORS[level]}
              name={level}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
