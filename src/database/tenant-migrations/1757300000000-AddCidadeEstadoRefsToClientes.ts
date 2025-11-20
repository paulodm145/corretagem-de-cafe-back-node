import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddCidadeEstadoRefsToClientes1757300000000 implements MigrationInterface {
  private readonly fkEstado = new TableForeignKey({
    name: 'FK_CLIENTES_ESTADO',
    columnNames: ['estado_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'estados',
    onDelete: 'RESTRICT',
  });

  private readonly fkCidade = new TableForeignKey({
    name: 'FK_CLIENTES_CIDADE',
    columnNames: ['cidade_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'cidades',
    onDelete: 'RESTRICT',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('clientes', [
      new TableColumn({ name: 'estado_id', type: 'integer', isNullable: true }),
      new TableColumn({ name: 'cidade_id', type: 'integer', isNullable: true }),
    ]);

    await queryRunner.query(`
      UPDATE clientes c
         SET estado_id = e.id
        FROM estados e
       WHERE upper(c.uf) = upper(e.sigla)
    `);

    await queryRunner.query(`
      UPDATE clientes c
         SET cidade_id = cid.id
        FROM cidades cid
       WHERE lower(c.cidade) = lower(cid.nome)
         AND c.estado_id = cid.estado_id
    `);

    await queryRunner.changeColumn(
      'clientes',
      'estado_id',
      new TableColumn({ name: 'estado_id', type: 'integer', isNullable: false }),
    );

    await queryRunner.changeColumn(
      'clientes',
      'cidade_id',
      new TableColumn({ name: 'cidade_id', type: 'integer', isNullable: false }),
    );

    await queryRunner.createForeignKeys('clientes', [this.fkEstado, this.fkCidade]);

    await queryRunner.dropColumns('clientes', ['uf', 'cidade']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('clientes', [
      new TableColumn({ name: 'uf', type: 'char', length: '2', isNullable: true }),
      new TableColumn({ name: 'cidade', type: 'varchar', length: '120', isNullable: true }),
    ]);

    await queryRunner.query(`
      UPDATE clientes c
         SET uf = e.sigla
        FROM estados e
       WHERE c.estado_id = e.id
    `);

    await queryRunner.query(`
      UPDATE clientes c
         SET cidade = cid.nome
        FROM cidades cid
       WHERE c.cidade_id = cid.id
    `);

    await queryRunner.changeColumn(
      'clientes',
      'uf',
      new TableColumn({ name: 'uf', type: 'char', length: '2', isNullable: false }),
    );

    await queryRunner.changeColumn(
      'clientes',
      'cidade',
      new TableColumn({ name: 'cidade', type: 'varchar', length: '120', isNullable: false }),
    );

    await queryRunner.dropForeignKeys('clientes', [this.fkEstado, this.fkCidade]);
    await queryRunner.dropColumns('clientes', ['estado_id', 'cidade_id']);
  }
}
