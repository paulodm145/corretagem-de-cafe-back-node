import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCidadeTable1756601362619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cidades",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "estado_id",
                        type: "integer",
                        isNullable: false,
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

        await queryRunner.createForeignKey("cidades", new TableForeignKey({
            columnNames: ["estado_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "estados",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("cidades", "FK_estado");
        await queryRunner.dropTable("cidades");
    }

}
