import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TipoContaBancaria } from '../../ENUMS/tipoContaBancaria';
import { TipoChavePix } from '../../ENUMS/tipoChavePix';

export class CreateContasBancariasTable1757002000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('contas_bancarias');
    if (tabelaExiste) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'contas_bancarias',
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
            name: 'banco_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'agencia',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'numero_conta',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'digito_conta',
            type: 'varchar',
            length: '5',
            isNullable: true,
          },
          {
            name: 'tipo_conta',
            type: 'enum',
            enum: Object.values(TipoContaBancaria),
            enumName: 'TIPO_CONTA_BANCARIA_ENUM',
            isNullable: true,
          },
          {
            name: 'tipo_chave_pix',
            type: 'enum',
            enum: Object.values(TipoChavePix),
            enumName: 'TIPO_CHAVE_PIX_ENUM',
            isNullable: true,
          },
          {
            name: 'chave_pix',
            type: 'varchar',
            length: '180',
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

    await queryRunner.createForeignKeys('contas_bancarias', [
      new TableForeignKey({
        columnNames: ['cliente_id'],
        referencedTableName: 'clientes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['banco_id'],
        referencedTableName: 'bancos',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('contas_bancarias');
    if (!tabelaExiste) {
      return;
    }

    const tabela = await queryRunner.getTable('contas_bancarias');
    if (tabela) {
      for (const foreignKey of tabela.foreignKeys) {
        await queryRunner.dropForeignKey('contas_bancarias', foreignKey);
      }
    }

    await queryRunner.dropTable('contas_bancarias');
  }
}
