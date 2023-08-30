import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices31692090373925 implements MigrationInterface {
    name = 'Invoices31692090373925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d8f8d3788694e1b3f96c42c36f\` ON \`invoices\``);
        await queryRunner.query(`CREATE INDEX \`invoice_number\` ON \`invoices\` (\`invoice_number\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`invoice_number\` ON \`invoices\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d8f8d3788694e1b3f96c42c36f\` ON \`invoices\` (\`invoice_number\`)`);
    }

}
