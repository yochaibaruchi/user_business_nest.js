import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckController } from './health-check/health-check.controller';
import { UserModule } from './user/user.module';
import { BusinessModule } from './business/business.module';
import { RoleModule } from './role/role.module';
import { UserBusinessRoleModule } from './userBusinessRole/user-business-role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'db/data-source';
import { InvoiceModule } from './invoice/invoice.module';
import { CognitoModule } from './cognito/cognito.module';
import { TagsModule } from './tags/tags.module';
import { DefaultBusinessModule } from './default-business/default-business.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { S3Module } from './s3/s3.module';

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
    TagsModule,
    DefaultBusinessModule,
    DashboardModule,
    S3Module,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService],
})
export class AppModule {}
