import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDadosEmpresaTable1757200000000 implements MigrationInterface {
  private readonly tabela = 'dados_empresa';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tabela,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'logo_base64',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '180',
            isNullable: false,
          },
          {
            name: 'telefone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'endereco',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'site',
            type: 'varchar',
            length: '200',
            isNullable: true,
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
            onUpdate: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tabela);
  }
}
