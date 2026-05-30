export interface ScoreRecord {
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  sinh_hoc: number | null;
  lich_su: number | null;
  dia_li: number | null;
  gdcd: number | null;
  ma_ngoai_ngu: string | null;
}

export type ScoreLevelKey = 'gte8' | 'gte6_lt8' | 'gte4_lt6' | 'lt4';

export interface SubjectDistribution {
  label: string;
  levels: Record<ScoreLevelKey, number>;
}

export interface DistributionResponse {
  description: string;
  subjects: Record<string, SubjectDistribution>;
}

export interface TopGroupAStudent {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total: number;
}

export interface TopGroupAResponse {
  description: string;
  group: string;
  subjects: string[];
  students: TopGroupAStudent[];
}

export const SCORE_LEVEL_LABELS: Record<ScoreLevelKey, string> = {
  gte8: '≥ 8 điểm',
  gte6_lt8: '6 –  Dưới 8',
  gte4_lt6: '4 –  Dưới 6',
  lt4: '<4',
};

export const SCORE_LEVEL_COLORS: Record<ScoreLevelKey, string> = {
  gte8: '#2563eb',
  gte6_lt8: '#0d9488',
  gte4_lt6: '#f59e0b',
  lt4: '#ef4444',
};

export const SUBJECT_DISPLAY: { key: keyof ScoreRecord; label: string }[] = [
  { key: 'toan', label: 'Toán' },
  { key: 'ngu_van', label: 'Ngữ văn' },
  { key: 'ngoai_ngu', label: 'Ngoại ngữ' },
  { key: 'vat_li', label: 'Vật lí' },
  { key: 'hoa_hoc', label: 'Hóa học' },
  { key: 'sinh_hoc', label: 'Sinh học' },
  { key: 'lich_su', label: 'Lịch sử' },
  { key: 'dia_li', label: 'Địa lí' },
  { key: 'gdcd', label: 'GDCD' },
];
