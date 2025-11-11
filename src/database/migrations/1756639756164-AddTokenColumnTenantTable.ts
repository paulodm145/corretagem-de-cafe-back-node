import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTokenColumnTenantTable1756639756164 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "tenant",
            new TableColumn({
                name: "token",
                type: "uuid",
                default: "uuid_generate_v4()",
                isNullable: false,
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
