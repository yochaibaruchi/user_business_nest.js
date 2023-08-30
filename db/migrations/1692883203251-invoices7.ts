import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices71692883203251 implements MigrationInterface {
    name = 'Invoices71692883203251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`user_user_uuid\` ON \`user\` (\`id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`user_user_uuid\` ON \`user\``);
    }

}
