import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('scores')
export class Score {
  @PrimaryColumn()
  sbd: string;
  @Column('float', { nullable: true })
  toan: number | null;
  @Column('float', { nullable: true })
  ngu_van: number | null;
  @Column('float', { nullable: true })
  ngoai_ngu: number | null;
  @Column('float', { nullable: true })
  vat_li: number | null;
  @Column('float', { nullable: true })
  hoa_hoc: number | null;
  @Column('float', { nullable: true })
  sinh_hoc: number | null;
  @Column('float', { nullable: true })
  lich_su: number | null;
  @Column('float', { nullable: true })
  dia_li: number | null;
  @Column('float', { nullable: true })
  gdcd: number | null;
  @Column('varchar',{ nullable: true })
  ma_ngoai_ngu: string | null;
}
