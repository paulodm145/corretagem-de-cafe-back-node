import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBancosTable1756625000000 implements MigrationInterface {
  private readonly tabela = new Table({
    name: 'bancos',
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'codigo',
        type: 'integer',
        isNullable: true,
      },
      {
        name: 'ispb',
        type: 'varchar',
        length: '20',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'nome',
        type: 'varchar',
        length: '150',
        isNullable: false,
      },
      {
        name: 'nome_completo',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.tabela);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tabela);
  }
}
