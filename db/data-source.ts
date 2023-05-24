import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOption: DataSourceOptions = {
  type: 'mysql', // Set the database type to 'mysql'
  host: process.env.MYSQL_HOST, // Get the host from MysqlConfigService
  port: +process.env.MYSQL_PORT, // Get the port from MysqlConfigService
  username: process.env.MYSQL_USER_NAME, // Get the username from MysqlConfigService
  password: process.env.MYSQL_ROOT_PASSWORD, // Get the password from MysqlConfigService
  database: process.env.MYSQL_DATABASE,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
