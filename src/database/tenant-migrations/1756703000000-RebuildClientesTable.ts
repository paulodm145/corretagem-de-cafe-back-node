import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { AtuacaoCliente } from '../../ENUMS/atuacaoCliente';
import { TipoCompradorCliente } from '../../ENUMS/tipoCompradorCliente';
import { TipoPessoaCliente } from '../../ENUMS/tipoPessoaCliente';

export class RebuildClientesTable1756703000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('clientes');
    if (tabelaExiste) {
      await queryRunner.dropTable('clientes', true);
    }

    await queryRunner.createTable(
      new Table({
        name: 'clientes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tipo_pessoa',
            type: 'enum',
            enum: Object.values(TipoPessoaCliente),
            enumName: 'TIPO_PESSOA_CLIENTE_ENUM',
            isNullable: false,
          },
          {
            name: 'documento',
            type: 'varchar',
            length: '20',
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
            name: 'tipo_comprador',
            type: 'enum',
            enum: Object.values(TipoCompradorCliente),
            enumName: 'TIPO_COMPRADOR_CLIENTE_ENUM',
            isNullable: false,
          },
          {
            name: 'atuacao',
            type: 'enum',
            enum: Object.values(AtuacaoCliente),
            enumName: 'ATUACAO_CLIENTE_ENUM',
            isNullable: false,
          },
          {
            name: 'data_nascimento',
            type: 'date',
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
            name: 'email',
            type: 'varchar',
            length: '180',
            isNullable: true,
          },
          {
            name: 'telefone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'observacao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'numero_car',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaExiste = await queryRunner.hasTable('clientes');
    if (tabelaExiste) {
      await queryRunner.dropTable('clientes', true);
    }

    await queryRunner.createTable(
      new Table({
        name: 'clientes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'razao_social',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },
          {
            name: 'endereco',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'cidade_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'estado_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'cep',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'telefone',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'whatsapp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'inscricao_estadual',
            type: 'varchar',
            length: '12',
            isNullable: true,
          },
          {
            name: 'site',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'logo',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
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

    await queryRunner.createForeignKeys('clientes', [
      new TableForeignKey({
        columnNames: ['cidade_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cidades',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['estado_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'estados',
        onDelete: 'CASCADE',
      }),
    ]);
  }
}
