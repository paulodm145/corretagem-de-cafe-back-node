import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsuariosTable1756605000000 implements MigrationInterface {
  private readonly tabela = new Table({
    name: 'usuarios',
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'nome',
        type: 'varchar',
        length: '150',
        isNullable: false,
      },
      {
        name: 'email',
        type: 'varchar',
        length: '180',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'senha_hash',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'ativo',
        type: 'boolean',
        default: 'true',
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()'
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()'
      }
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.tabela);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tabela);
  }
}
