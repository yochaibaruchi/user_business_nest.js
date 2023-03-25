// MysqlConfigModule.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the ConfigModule global, so you don't need to import it in other modules
      envFilePath: '.env', // Specify the path to your .env file, usually located in the root directory of your project
    }),
  ],
  providers: [MysqlConfigService],
  exports: [MysqlConfigService],
})
export class MysqlConfigModule {}