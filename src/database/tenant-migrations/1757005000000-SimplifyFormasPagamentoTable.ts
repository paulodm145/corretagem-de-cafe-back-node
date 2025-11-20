import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SimplifyFormasPagamentoTable1757005000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('formas_pagamento');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('formas_pagamento');
    const colunaNome = tabela?.findColumnByName('nome');
    if (colunaNome) {
      await queryRunner.dropColumn('formas_pagamento', colunaNome);
    }

    const colunaDescricao = tabela?.findColumnByName('descricao');
    if (colunaDescricao) {
      await queryRunner.changeColumn(
        'formas_pagamento',
        colunaDescricao,
        new TableColumn({
          name: 'descricao',
          type: 'varchar',
          length: '150',
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('formas_pagamento');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('formas_pagamento');
    const colunaDescricao = tabela?.findColumnByName('descricao');
    if (colunaDescricao) {
      await queryRunner.changeColumn(
        'formas_pagamento',
        colunaDescricao,
        new TableColumn({
          name: 'descricao',
          type: 'varchar',
          length: '255',
          isNullable: true,
        }),
      );
    }

    const colunaNome = tabela?.findColumnByName('nome');
    if (!colunaNome) {
      await queryRunner.addColumn(
        'formas_pagamento',
        new TableColumn({
          name: 'nome',
          type: 'varchar',
          length: '120',
          isUnique: true,
        }),
      );
    }
  }
}
