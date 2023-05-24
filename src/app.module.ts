import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckController } from './health-check/health-check.controller';
import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { RoleModule } from './role/role.module';
import { UserBusinessRoleModule } from './userBusinessRole/user-business-role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'db/data-source';
import { InvoiceModule } from './invoice/invoice.module';
import { CognitoModule } from './cognito/cognito.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    TerminusModule,
    UserModule,
    // AuthModule,
    BusinessModule,
    RoleModule,
    UserBusinessRoleModule,
    InvoiceModule,
    CognitoModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService],
})
export class AppModule {}
