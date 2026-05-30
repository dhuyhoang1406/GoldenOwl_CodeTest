import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Score } from '../../module/score/score.entity';
import { CsvRow } from './csv-row.type';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async onModuleInit(): Promise<void> {
    if (process.env.SEED_ON_STARTUP === 'true') {
      await this.seed();
    }
  }

  resolveCsvPath(): string {
    if (process.env.CSV_FILE_PATH && existsSync(process.env.CSV_FILE_PATH)) {
      return process.env.CSV_FILE_PATH;
    }

    const candidates = [
      path.join(process.cwd(), '..', 'dataset', 'diem_thi_thpt_2024.csv'),
      path.join(process.cwd(), 'dataset', 'diem_thi_thpt_2024.csv'),
    ];

    const found = candidates.find((p) => existsSync(p));
    if (!found) {
      throw new Error(
        `Không tìm thấy file CSV. Đặt CSV_FILE_PATH hoặc đặt file tại: ${candidates.join(', ')}`,
      );
    }
    return found;
  }

  private mapRow(row: CsvRow): Partial<Score> {
    const parseScore = (val: string | undefined): number | null =>
      val === '' || val == null ? null : parseFloat(val);

    return {
      sbd: row.sbd,
      toan: parseScore(row.toan as unknown as string),
      ngu_van: parseScore(row.ngu_van as unknown as string),
      ngoai_ngu: parseScore(row.ngoai_ngu as unknown as string),
      vat_li: parseScore(row.vat_li as unknown as string),
      hoa_hoc: parseScore(row.hoa_hoc as unknown as string),
      sinh_hoc: parseScore(row.sinh_hoc as unknown as string),
      lich_su: parseScore(row.lich_su as unknown as string),
      dia_li: parseScore(row.dia_li as unknown as string),
      gdcd: parseScore(row.gdcd as unknown as string),
      ma_ngoai_ngu: row.ma_ngoai_ngu?.trim() || null,
    };
  }

  async seed(): Promise<void> {
    const count = await this.scoreRepository.count();
    if (count > 0) {
      this.logger.log(`Bỏ qua seed — đã có ${count} bản ghi trong bảng scores`);
      return;
    }

    const csvFilePath = this.resolveCsvPath();
    this.logger.log(`Đang import dữ liệu từ: ${csvFilePath}`);

    const BATCH = 5000;
    let batch: Partial<Score>[] = [];
    let total = 0;

    const stream = createReadStream(csvFilePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }),
    );

    for await (const row of stream) {
      batch.push(this.mapRow(row as CsvRow));
      if (batch.length >= BATCH) {
        await this.scoreRepository.insert(batch);
        total += batch.length;
        this.logger.log(`Đã import ${total} bản ghi...`);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await this.scoreRepository.insert(batch);
      total += batch.length;
    }

    this.logger.log(`Import hoàn tất: ${total} bản ghi`);
  }
}
