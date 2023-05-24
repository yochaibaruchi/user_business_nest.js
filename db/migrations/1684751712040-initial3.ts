import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial31684751712040 implements MigrationInterface {
    name = 'Initial31684751712040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`confirmEmail\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`confirmEmail\``);
    }

}
