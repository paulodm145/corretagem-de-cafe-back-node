import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTenantTable1756602909824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tenant",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "cliente_id",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "dbName",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "dbHost",
                        type: "varchar",
                        isNullable: true,
                        default: "'localhost'"
                    },
                    {
                        name: "dbPort",
                        type: "int",
                        isNullable: true,
                        default: 5432
                    },
                    {
                        name: "dbUsername",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "dbPassword",
                        type: "varchar",
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

        await queryRunner.createForeignKey("tenant", new TableForeignKey({
            columnNames: ["cliente_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "clientes",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
