import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { RoleModule } from './role/role.module';
import { UserBusinessRoleModule } from './user-business-role/user-business-role.module';
@Module({
  imports: [MysqlDatabaseProviderModule, TerminusModule,UserModule ,AuthModule , BusinessModule, RoleModule, UserBusinessRoleModule],
  controllers: [AppController, HealthCheckController],
  providers: [AppService],
})
export class AppModule {}
