import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { MysqlConfigModule } from '../../../config/database/mysql/config.module';
import { MysqlConfigService } from '../../../config/database/mysql/config.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Business } from 'src/business/entities/business.entity';
import { UserBusinessRole } from 'src/user-business-role/entities/user-business-role.entity';


// Define the MysqlDatabaseProviderModule
@Module({
  imports: [
    // Import TypeOrmModule with asynchronous configuration
    TypeOrmModule.forRootAsync({
      // Import the MysqlConfigModule, which provides the MysqlConfigService
      imports: [MysqlConfigModule],

      // Define a factory function that uses MysqlConfigService to get the MySQL configuration
      useFactory: async (mysqlConfigService: MysqlConfigService) => ({
        type: 'mysql' as DatabaseType, // Set the database type to 'mysql'
        host: mysqlConfigService.host, // Get the host from MysqlConfigService
        port: mysqlConfigService.port, // Get the port from MysqlConfigService
        username: mysqlConfigService.username, // Get the username from MysqlConfigService
        password: mysqlConfigService.password, // Get the password from MysqlConfigService
        database: mysqlConfigService.database, // Get the database name from MysqlConfigService

        synchronize: false, 
        // Specify the entities (schemas) for the MySQL database
        entities: [UserBusinessRole,User,Business,Role],
        migrations: [__dirname + '/../../src/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
        migrationsRun : true,
        autoLoadEntities: true,
        logging : true,
     
      }),

      // Inject MysqlConfigService as a dependency for the factory function
      inject: [MysqlConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
// Export the MysqlDatabaseProviderModule
export class MysqlDatabaseProviderModule {}
