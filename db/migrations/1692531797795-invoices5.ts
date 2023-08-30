import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices51692531797795 implements MigrationInterface {
    name = 'Invoices51692531797795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` ADD \`client_name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` DROP COLUMN \`client_name\``);
    }

}
