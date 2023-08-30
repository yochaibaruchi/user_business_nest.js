import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices11690723104835 implements MigrationInterface {
    name = 'Invoices11690723104835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_cace4a159ff9f2512dd42373760\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_cace4a159ff9f2512dd42373760\` FOREIGN KEY (\`id\`) REFERENCES \`default_business\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
