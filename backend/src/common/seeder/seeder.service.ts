import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Score } from '../../module/score/score.entity';
import { CsvRow } from './csv-row.type';
const DEFAULT_BATCH_SIZE = 500;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

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
  private getBatchSize(): number {
    const parsed = parseInt(process.env.SEED_BATCH_SIZE ?? '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_BATCH_SIZE;
  }
  private isConnectionError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return (
      message.includes('Connection terminated') ||
      message.includes('ECONNRESET') ||
      message.includes('ETIMEDOUT') ||
      message.includes('connection timeout')
    );
  }
  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async insertBatch(batch: Partial<Score>[]): Promise<void> {
    await this.scoreRepository
      .createQueryBuilder()
      .insert()
      .into(Score)
      .values(batch)
      .orIgnore()
      .execute();
  }

  private async insertBatchWithRetry(batch: Partial<Score>[]): Promise<void> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.insertBatch(batch);
        return;
      } catch (error) {
        if (!this.isConnectionError(error) || attempt === MAX_RETRIES) {
          throw error;
        }
        this.logger.warn(
          `Mất kết nối DB, thử lại (${attempt}/${MAX_RETRIES}) sau ${RETRY_DELAY_MS}ms...`,
        );
        await this.sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }
  async seed(): Promise<void> {
    const existingCount = await this.scoreRepository.count();
    const csvFilePath = this.resolveCsvPath();
    const batchSize = this.getBatchSize();
    if (existingCount > 0) {
      this.logger.log(
        `Tiếp tục import — đã có ${existingCount} bản ghi, bỏ qua SBD trùng...`,
      );
    }
    this.logger.log(
      `Đang import dữ liệu từ: ${csvFilePath} (batch=${batchSize})`,
    );
    let batch: Partial<Score>[] = [];
    let inserted = 0;
    let processed = 0;
    const stream = createReadStream(csvFilePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }),
    );
    for await (const row of stream) {
      batch.push(this.mapRow(row as CsvRow));
      processed++;
      if (batch.length >= batchSize) {
        await this.insertBatchWithRetry(batch);
        inserted += batch.length;
        this.logger.log(
          `Đã xử lý ${processed} dòng (${inserted} trong batch gần nhất)...`,
        );
        batch = [];
        await this.sleep(100);
      }
    }
    if (batch.length > 0) {
      await this.insertBatchWithRetry(batch);
      inserted += batch.length;
    }
    const finalCount = await this.scoreRepository.count();
    this.logger.log(
      `Import hoàn tất — ${processed} dòng CSV, ${finalCount} bản ghi trong DB`,
    );
  }
}
