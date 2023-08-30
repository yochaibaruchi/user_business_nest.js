import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices41692181883064 implements MigrationInterface {
    name = 'Invoices41692181883064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` ADD \`image_path\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` DROP COLUMN \`image_path\``);
    }

}
