import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLocaisDescargaTable1756900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('locais_descarga');
    if (tabelaExiste) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'locais_descarga',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cliente_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'cep',
            type: 'varchar',
            length: '8',
            isNullable: false,
          },
          {
            name: 'endereco',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'numero',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'uf',
            type: 'char',
            length: '2',
            isNullable: false,
          },
          {
            name: 'cidade',
            type: 'varchar',
            length: '120',
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

    await queryRunner.createForeignKey(
      'locais_descarga',
      new TableForeignKey({
        columnNames: ['cliente_id'],
        referencedTableName: 'clientes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('locais_descarga');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('locais_descarga');
    if (tabela) {
      const chaveEstrangeira = tabela.foreignKeys.find((fk) => fk.columnNames.includes('cliente_id'));
      if (chaveEstrangeira) {
        await queryRunner.dropForeignKey('locais_descarga', chaveEstrangeira);
      }
    }

    await queryRunner.dropTable('locais_descarga');
  }
}
