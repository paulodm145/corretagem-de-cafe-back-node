import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVendasTable1757100000001 implements MigrationInterface {
  private readonly tabela = 'vendas';
  private readonly foreignKey = new TableForeignKey({
    columnNames: ['cliente_id'],
    referencedTableName: 'clientes',
    referencedColumnNames: ['id'],
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    name: 'FK_VENDAS_CLIENTES',
  });

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
            name: 'numero_contrato',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'cliente_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'produto',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'quantidade_sacas',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'preco_medio',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'data_venda',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'observacoes',
            type: 'text',
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

    await queryRunner.createForeignKey(this.tabela, this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tabela, this.foreignKey);
    await queryRunner.dropTable(this.tabela);
  }
}
