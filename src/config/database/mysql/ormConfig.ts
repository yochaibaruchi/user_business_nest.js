import { ConfigService } from '@nestjs/config';
import { MysqlConfigService } from './config.service';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Business } from 'src/business/entities/business.entity';
import { UserBusinessRole } from 'src/userBusinessRole/entities/user-business-role.entity';
import { Role } from 'src/role/entities/role.entity';

dotenv.config();

const configService = new ConfigService(process.env);
const mysqlConfigService = new MysqlConfigService(configService);

dotenv.config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: mysqlConfigService.host,
  port: mysqlConfigService.port,
  username: mysqlConfigService.username,
  password: mysqlConfigService.password,
  database: mysqlConfigService.database,
  entities: [User, Business, Role, UserBusinessRole],
  // migrations: [
  //   $npmConfigName1681727201133,
  //   $npmConfigName1681728038784,
  //   $npmConfigName1681736365263,
  //   $npmConfigName1681738652430,
  //   $npmConfigName1681738990419,
  // ],
  migrationsTableName: 'migrations',
  synchronize: false,
  dropSchema: false,
});
