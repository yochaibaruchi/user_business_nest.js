import { Module, forwardRef } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { UserBusinessRoleModule } from 'src/userBusinessRole/user-business-role.module';
import { DefaultBusinessService } from 'src/default-business/default-business.service';
import { DefaultBusinessModule } from 'src/default-business/default-business.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business]),
    forwardRef(() => UserBusinessRoleModule),
    DefaultBusinessModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
