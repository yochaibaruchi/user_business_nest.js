import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices61692555731192 implements MigrationInterface {
    name = 'Invoices61692555731192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`image_path\` \`image_path\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`image_path\` \`image_path\` varchar(255) NOT NULL`);
    }

}
