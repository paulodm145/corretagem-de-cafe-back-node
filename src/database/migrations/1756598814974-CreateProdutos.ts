import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
} from "typeorm"

export class CreateProdutos1756598814974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "produtos",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        generationStrategy: "increment",
                    }),
                    new TableColumn({
                        name: "descricao",
                        type: "text",
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    }),
                    new TableColumn({
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    }),
                ],
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
