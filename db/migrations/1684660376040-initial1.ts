import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial11684660376040 implements MigrationInterface {
    name = 'Initial11684660376040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`is_admin\` tinyint NOT NULL DEFAULT 1, \`refresh_token\` varchar(1024) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_business_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(255) NOT NULL, \`business_id\` int NOT NULL, \`role_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`business\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`business_type\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`bank_account_id\` varchar(255) NOT NULL, \`bank_id\` int NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_cf30d852aec52dc2562dc7d3d8\` (\`bank_account_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invoices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`invoiceNumber\` varchar(255) AS (JSON_UNQUOTE(JSON_EXTRACT(data, '$.invoiceNumber'))) STORED NOT NULL, \`amount\` varchar(255) AS (JSON_UNQUOTE(JSON_EXTRACT(data, '$.amount'))) STORED NOT NULL, \`invoiceDate\` datetime AS (JSON_UNQUOTE(JSON_EXTRACT(data, '$.invoiceDate'))) STORED NOT NULL, \`dueDate\` datetime AS (JSON_UNQUOTE(JSON_EXTRACT(data, '$.dueDate'))) STORED NOT NULL, \`data\` json NOT NULL, \`businessId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`INSERT INTO \`billy1\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["billy1","invoices","GENERATED_COLUMN","invoiceNumber","JSON_UNQUOTE(JSON_EXTRACT(data, '$.invoiceNumber'))"]);
        await queryRunner.query(`INSERT INTO \`billy1\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["billy1","invoices","GENERATED_COLUMN","amount","JSON_UNQUOTE(JSON_EXTRACT(data, '$.amount'))"]);
        await queryRunner.query(`INSERT INTO \`billy1\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["billy1","invoices","GENERATED_COLUMN","invoiceDate","JSON_UNQUOTE(JSON_EXTRACT(data, '$.invoiceDate'))"]);
        await queryRunner.query(`INSERT INTO \`billy1\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["billy1","invoices","GENERATED_COLUMN","dueDate","JSON_UNQUOTE(JSON_EXTRACT(data, '$.dueDate'))"]);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_3a233053bcd9e9f0b310f0f93e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_5705c00326325e8337238bd0f18\` FOREIGN KEY (\`business_id\`) REFERENCES \`business\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_e49c64c1de89eaa90f0bcb33e47\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoices\` ADD CONSTRAINT \`business_invoice\` FOREIGN KEY (\`businessId\`) REFERENCES \`business\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoices\` DROP FOREIGN KEY \`business_invoice\``);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_e49c64c1de89eaa90f0bcb33e47\``);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_5705c00326325e8337238bd0f18\``);
        await queryRunner.query(`ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_3a233053bcd9e9f0b310f0f93e8\``);
        await queryRunner.query(`DELETE FROM \`billy1\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","dueDate","billy1","invoices"]);
        await queryRunner.query(`DELETE FROM \`billy1\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","invoiceDate","billy1","invoices"]);
        await queryRunner.query(`DELETE FROM \`billy1\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","amount","billy1","invoices"]);
        await queryRunner.query(`DELETE FROM \`billy1\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","invoiceNumber","billy1","invoices"]);
        await queryRunner.query(`DROP TABLE \`invoices\``);
        await queryRunner.query(`DROP INDEX \`IDX_cf30d852aec52dc2562dc7d3d8\` ON \`business\``);
        await queryRunner.query(`DROP TABLE \`business\``);
        await queryRunner.query(`DROP TABLE \`user_business_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
