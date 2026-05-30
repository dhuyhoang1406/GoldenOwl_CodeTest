import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './score.entity';
import { Subject } from './subject.class';

export type ScoreLevelKey = 'gte8' | 'gte6_lt8' | 'gte4_lt6' | 'lt4';

export interface SubjectDistribution {
  label: string;
  levels: Record<ScoreLevelKey, number>;
}

export interface TopGroupAStudent {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total: number;
}

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async findBySbd(sbd: string): Promise<Score | null> {
    return this.scoreRepository.findOne({ where: { sbd } });
  }

  async getScoreDistribution(): Promise<Record<string, SubjectDistribution>> {
    const subjects = Subject.getAll();
    const result: Record<string, SubjectDistribution> = {};

    for (const subject of subjects) {
      const col = subject.key;
      const row = await this.scoreRepository
        .createQueryBuilder('s')
        .select(`COUNT(*) FILTER (WHERE s.${col} >= 8)`, 'gte8')
        .addSelect(
          `COUNT(*) FILTER (WHERE s.${col} >= 6 AND s.${col} < 8)`,
          'gte6_lt8',
        )
        .addSelect(
          `COUNT(*) FILTER (WHERE s.${col} >= 4 AND s.${col} < 6)`,
          'gte4_lt6',
        )
        .addSelect(
          `COUNT(*) FILTER (WHERE s.${col} < 4 AND s.${col} IS NOT NULL)`,
          'lt4',
        )
        .getRawOne<{
          gte8: string;
          gte6_lt8: string;
          gte4_lt6: string;
          lt4: string;
        }>();

      result[col] = {
        label: subject.label,
        levels: {
          gte8: Number(row?.gte8 ?? 0),
          gte6_lt8: Number(row?.gte6_lt8 ?? 0),
          gte4_lt6: Number(row?.gte4_lt6 ?? 0),
          lt4: Number(row?.lt4 ?? 0),
        },
      };
    }

    return result;
  }

  async getTopGroupA(limit = 10): Promise<TopGroupAStudent[]> {
    const rows = await this.scoreRepository
      .createQueryBuilder('s')
      .select('s.sbd', 'sbd')
      .addSelect('s.toan', 'toan')
      .addSelect('s.vat_li', 'vat_li')
      .addSelect('s.hoa_hoc', 'hoa_hoc')
      .addSelect('(s.toan + s.vat_li + s.hoa_hoc)', 'total')
      .where('s.toan IS NOT NULL')
      .andWhere('s.vat_li IS NOT NULL')
      .andWhere('s.hoa_hoc IS NOT NULL')
      .orderBy('total', 'DESC')
      .limit(limit)
      .getRawMany<{
        sbd: string;
        toan: string;
        vat_li: string;
        hoa_hoc: string;
        total: string;
      }>();

    return rows.map((row) => ({
      sbd: row.sbd,
      toan: Number(row.toan),
      vat_li: Number(row.vat_li),
      hoa_hoc: Number(row.hoa_hoc),
      total: Number(row.total),
    }));
  }

  getSubjects(): Subject[] {
    return Subject.getAll();
  }
}
