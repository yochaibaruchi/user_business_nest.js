import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [S3Controller],
  providers: [S3Service],
  imports: [ConfigModule],
  exports: [S3Service],
})
export class S3Module {}
