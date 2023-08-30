import { MigrationInterface, QueryRunner } from "typeorm";

export class Invoices1690722707944 implements MigrationInterface {
    name = 'Invoices1690722707944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`default_business\` (\`user_id\` varchar(255) NOT NULL, \`business_id\` int NOT NULL, UNIQUE INDEX \`user_business_default_UNIQUE\` (\`user_id\`, \`business_id\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NULL, \`confirmEmail\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_business_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`business_id\` int NOT NULL, \`role_id\` int NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`business_tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`business_id\` int NOT NULL, UNIQUE INDEX \`text_business_tag_UNIQUE\` (\`text\`, \`business_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invoices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`invoiceType\` enum ('INCOME', 'EXPENSE') NOT NULL, \`invoice_number\` varchar(255) NOT NULL, \`sum\` decimal(12,2) NOT NULL, \`currency\` varchar(255) NOT NULL, \`issue_date\` datetime NOT NULL, \`email_adress\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, \`item\` varchar(255) NOT NULL, \`businessId\` int NOT NULL, UNIQUE INDEX \`IDX_d8f8d3788694e1b3f96c42c36f\` (\`invoice_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`business\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`business_type\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`bank_account_id\` varchar(255) NOT NULL, \`bank_id\` int NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_cf30d852aec52dc2562dc7d3d8\` (\`bank_account_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`default_business\` ADD CONSTRAINT \`FK_2909c9a29ee6dffcc83b3d9ccc4\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`default_business\` ADD CONSTRAINT \`FK_e1d3391c7aaa12c4939d8098aba\` FOREIGN KEY (\`business_id\`) REFERENCES \`business\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_cace4a159ff9f2512dd42373760\` FOREIGN KEY (\`id\`) REFERENCES \`default_business\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_3a233053bcd9e9f0b310f0f93e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_5705c00326325e8337238bd0f18\` FOREIGN KEY (\`business_id\`) REFERENCES \`business\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_e49c64c1de89eaa90f0bcb33e47\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`business_tag\` ADD CONSTRAINT \`FK_c12ad57c80d9387e29c8b7a63d7\` FOREIGN KEY (\`business_id\`) REFERENCES \`business\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoices\` ADD CONSTRAINT \`business_invoice\` FOREIGN KEY (\`businessId\`) REFERENCES \`business\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` DROP FOREIGN KEY \`business_invoice\``);
        await queryRunner.query(`ALTER TABLE \`business_tag\` DROP FOREIGN KEY \`FK_c12ad57c80d9387e29c8b7a63d7\``);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_e49c64c1de89eaa90f0bcb33e47\``);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_5705c00326325e8337238bd0f18\``);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_3a233053bcd9e9f0b310f0f93e8\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_cace4a159ff9f2512dd42373760\``);
        await queryRunner.query(`ALTER TABLE \`default_business\` DROP FOREIGN KEY \`FK_e1d3391c7aaa12c4939d8098aba\``);
        await queryRunner.query(`ALTER TABLE \`default_business\` DROP FOREIGN KEY \`FK_2909c9a29ee6dffcc83b3d9ccc4\``);
        await queryRunner.query(`DROP INDEX \`IDX_cf30d852aec52dc2562dc7d3d8\` ON \`business\``);
        await queryRunner.query(`DROP TABLE \`business\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8f8d3788694e1b3f96c42c36f\` ON \`invoices\``);
        await queryRunner.query(`DROP TABLE \`invoices\``);
        await queryRunner.query(`DROP INDEX \`text_business_tag_UNIQUE\` ON \`business_tag\``);
        await queryRunner.query(`DROP TABLE \`business_tag\``);
        await queryRunner.query(`DROP TABLE \`user_business_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`user_business_default_UNIQUE\` ON \`default_business\``);
        await queryRunner.query(`DROP TABLE \`default_business\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
