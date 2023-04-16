
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MysqlConfigService } from './config.service';
import { User } from '../../../user/entities/user.entity';
import * as dotenv from 'dotenv';



dotenv.config();
 
const configService = new ConfigService(process.env);
const mysqlConfigService = new MysqlConfigService(configService);
 
export default new DataSource({
  type: 'mysql',
  host: mysqlConfigService.host,
  port: mysqlConfigService.port,
  username: mysqlConfigService.username,
  password: mysqlConfigService.password,
  database: mysqlConfigService.database,
  entities: [User],
  migrations:  [],
});







