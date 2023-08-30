// src/user/user.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CognitoModule } from 'src/cognito/cognito.module';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CognitoModule),
    InvoiceModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export UserService to be used in other modules like AuthModule
})
export class UserModule {}
