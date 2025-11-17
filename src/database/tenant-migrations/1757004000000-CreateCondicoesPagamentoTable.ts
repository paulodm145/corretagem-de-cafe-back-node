import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'forma_pagamento_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'quantidade_parcelas',
            type: 'integer',
            default: 1,
          },
          {
            name: 'primeira_parcela_em_dias',
            type: 'integer',
            default: 0,
          },
          {
            name: 'intervalo_dias',
            type: 'integer',
            default: 0,
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

    await queryRunner.createForeignKey(
      'condicoes_pagamento',
      new TableForeignKey({
        columnNames: ['forma_pagamento_id'],
        referencedTableName: 'formas_pagamento',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('condicoes_pagamento');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('condicoes_pagamento');
    if (tabela) {
      for (const foreignKey of tabela.foreignKeys) {
        await queryRunner.dropForeignKey('condicoes_pagamento', foreignKey);
      }
    }

    await queryRunner.dropTable('condicoes_pagamento');
  }
}
