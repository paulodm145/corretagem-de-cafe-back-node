import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTenantsTable1756645000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    if (await queryRunner.hasTable('tenant')) {
      await queryRunner.dropTable('tenant', true);
    }

    if (await queryRunner.hasTable('tenants')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'tenants',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'razao_social',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'inscricao_estadual',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email_contato',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'telefone_contato',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'cliente_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'dbName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'dbHost',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'dbPort',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'dbUsername',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'dbPassword',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'dbSsl',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'status',
            type: 'boolean',
            default: 'true',
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
          },
          {
            name: 'token',
            type: 'uuid',
            default: "uuid_generate_v4()",
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('tenants')) {
      await queryRunner.dropTable('tenants', true);
    }
  }
}
