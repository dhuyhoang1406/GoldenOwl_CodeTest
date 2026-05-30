import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateScoresTable1748610000000 implements MigrationInterface {
  name = 'CreateScoresTable1748610000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'scores',
        columns: [
          {
            name: 'sbd',
            type: 'varchar',
            length: '20',
            isPrimary: true,
          },
          { name: 'toan', type: 'float', isNullable: true },
          { name: 'ngu_van', type: 'float', isNullable: true },
          { name: 'ngoai_ngu', type: 'float', isNullable: true },
          { name: 'vat_li', type: 'float', isNullable: true },
          { name: 'hoa_hoc', type: 'float', isNullable: true },
          { name: 'sinh_hoc', type: 'float', isNullable: true },
          { name: 'lich_su', type: 'float', isNullable: true },
          { name: 'dia_li', type: 'float', isNullable: true },
          { name: 'gdcd', type: 'float', isNullable: true },
          { name: 'ma_ngoai_ngu', type: 'varchar', isNullable: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('scores');
  }
}
