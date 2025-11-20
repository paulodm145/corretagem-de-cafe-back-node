import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EnsurePagamentosIdsAutoIncrement1757007000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.configurarAutoIncremento(queryRunner, 'formas_pagamento');
    await this.configurarAutoIncremento(queryRunner, 'condicoes_pagamento');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.removerAutoIncremento(queryRunner, 'condicoes_pagamento');
    await this.removerAutoIncremento(queryRunner, 'formas_pagamento');
  }

  private async configurarAutoIncremento(queryRunner: QueryRunner, nomeTabela: string): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable(nomeTabela);
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable(nomeTabela);
    const colunaId = tabela?.findColumnByName('id');

    if (!colunaId || colunaId.isGenerated) {
      return;
    }

    await queryRunner.changeColumn(
      nomeTabela,
      colunaId,
      new TableColumn({
        name: 'id',
        type: colunaId.type,
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
        isNullable: false,
      }),
    );
  }

  private async removerAutoIncremento(queryRunner: QueryRunner, nomeTabela: string): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable(nomeTabela);
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable(nomeTabela);
    const colunaId = tabela?.findColumnByName('id');

    if (!colunaId || !colunaId.isGenerated) {
      return;
    }

    await queryRunner.changeColumn(
      nomeTabela,
      colunaId,
      new TableColumn({
        name: 'id',
        type: colunaId.type,
        isPrimary: true,
        isNullable: false,
      }),
    );
  }
}
