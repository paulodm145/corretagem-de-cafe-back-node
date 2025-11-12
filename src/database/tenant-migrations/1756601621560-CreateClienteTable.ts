import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateClienteTable1756601621560 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "clientes",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nome_fantasia",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "razao_social",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "cnpj",
                        type: "varchar",
                        isNullable: false,
                        length: "14",
                    },
                    {
                       name: "endereco",
                       type: "varchar",
                       isNullable: false,
                       length: "255",
                    },
                    {
                        name: "complemento",
                        type: "varchar",
                        isNullable: true,
                        length: "255",
                    },
                    {
                        name: "bairro",
                        type: "varchar",
                        isNullable: false,
                        length: "100",
                    },
                    {
                        name: "cidade_id",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "estado_id",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "cep",
                        type: "varchar",
                        isNullable: false,
                        length: "10",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "telefone",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "whatsapp",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "inscricao_estadual",
                        type: "varchar",
                        isNullable: true,
                        length: "12",
                    },
                    {
                        name: "site",
                        type: "varchar",
                        isNullable: true,
                        length: "255",
                    },
                    {
                        name: "logo",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );

        await queryRunner.createForeignKey("clientes", new TableForeignKey({
            columnNames: ["cidade_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "cidades",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("clientes", new TableForeignKey({
            columnNames: ["estado_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "estados",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
