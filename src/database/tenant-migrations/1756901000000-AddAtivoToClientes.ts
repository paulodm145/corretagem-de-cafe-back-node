import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAtivoToClientes1756901000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('clientes');
    if (!tabelaExiste) {
      return;
    }

    const colunaExiste = await queryRunner.hasColumn('clientes', 'ativo');
    if (colunaExiste) {
      return;
    }

    await queryRunner.addColumn(
      'clientes',
      new TableColumn({
        name: 'ativo',
        type: 'boolean',
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('clientes');
    if (!tabelaExiste) {
      return;
    }

    const colunaExiste = await queryRunner.hasColumn('clientes', 'ativo');
    if (!colunaExiste) {
      return;
    }

    await queryRunner.dropColumn('clientes', 'ativo');
  }
}
