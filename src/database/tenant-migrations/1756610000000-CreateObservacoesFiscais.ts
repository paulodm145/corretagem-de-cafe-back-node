import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateObservacoesFiscais1756610000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'observacoes_fiscais',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'tipo',
            type: 'enum',
            enum: ['PRODUTOR', 'EMPRESAS'],
            enumName: 'observacao_fiscal_tipo_enum',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('observacoes_fiscais');
    await queryRunner.query('DROP TYPE IF EXISTS "observacao_fiscal_tipo_enum";');
  }
}
