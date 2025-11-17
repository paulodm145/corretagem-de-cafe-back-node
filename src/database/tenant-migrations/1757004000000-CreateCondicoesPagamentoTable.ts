import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCondicoesPagamentoTable1757004000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('condicoes_pagamento');
    if (tabelaExiste) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'condicoes_pagamento',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '150',
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
            onUpdate: 'now()',
          },
        ],
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('condicoes_pagamento');
    if (!tabelaExiste) {
      return;
    }

    await queryRunner.dropTable('condicoes_pagamento');
  }
}
