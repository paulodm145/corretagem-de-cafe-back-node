import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class SimplifyCondicoesPagamentoTable1757006000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('condicoes_pagamento');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('condicoes_pagamento');
    const foreignKey = tabela?.foreignKeys.find((fk) => fk.columnNames.includes('forma_pagamento_id'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('condicoes_pagamento', foreignKey);
    }

    const colunasRemover = [
      'forma_pagamento_id',
      'quantidade_parcelas',
      'primeira_parcela_em_dias',
      'intervalo_dias',
    ];

    for (const colunaNome of colunasRemover) {
      const coluna = tabela?.findColumnByName(colunaNome);
      if (coluna) {
        await queryRunner.dropColumn('condicoes_pagamento', coluna);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('condicoes_pagamento');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('condicoes_pagamento');

    const colunasAdicionar: TableColumn[] = [
      new TableColumn({
        name: 'forma_pagamento_id',
        type: 'integer',
        isNullable: false,
      }),
      new TableColumn({
        name: 'quantidade_parcelas',
        type: 'integer',
        default: 1,
      }),
      new TableColumn({
        name: 'primeira_parcela_em_dias',
        type: 'integer',
        default: 0,
      }),
      new TableColumn({
        name: 'intervalo_dias',
        type: 'integer',
        default: 0,
      }),
    ];

    for (const coluna of colunasAdicionar) {
      const existeColuna = tabela?.findColumnByName(coluna.name);
      if (!existeColuna) {
        await queryRunner.addColumn('condicoes_pagamento', coluna);
      }
    }

    const foreignKeyExiste = tabela?.foreignKeys.find((fk) => fk.columnNames.includes('forma_pagamento_id'));
    if (!foreignKeyExiste) {
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
  }
}
