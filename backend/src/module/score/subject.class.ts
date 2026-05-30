import { Score } from './score.entity';

export type SubjectGroup = 'mandatory' | 'social' | 'natural';

export class Subject {
  constructor(
    public readonly key: keyof Omit<Score, 'sbd' | 'ma_ngoai_ngu'>,
    public readonly label: string,
    public readonly group: SubjectGroup,
  ) {}

  getScoreFromRecord(record: Score): number | null {
    const value = record[this.key];
    return typeof value === 'number' ? value : null;
  }

  static getAll(): Subject[] {
    return [
      new Subject('toan', 'Toán', 'mandatory'),
      new Subject('ngu_van', 'Ngữ văn', 'mandatory'),
      new Subject('ngoai_ngu', 'Ngoại ngữ', 'mandatory'),
      new Subject('vat_li', 'Vật lí', 'natural'),
      new Subject('hoa_hoc', 'Hóa học', 'natural'),
      new Subject('sinh_hoc', 'Sinh học', 'natural'),
      new Subject('lich_su', 'Lịch sử', 'social'),
      new Subject('dia_li', 'Địa lí', 'social'),
      new Subject('gdcd', 'Giáo dục công dân', 'social'),
    ];
  }

  static findByKey(key: string): Subject | undefined {
    return Subject.getAll().find((s) => s.key === key);
  }
}
