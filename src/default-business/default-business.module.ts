import { Module } from '@nestjs/common';
import { DefaultBusinessService } from './default-business.service';
import { DefaultBusinessController } from './default-business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultBusiness } from './entities/default-business.entity';
import { UserBusinessRoleModule } from 'src/userBusinessRole/user-business-role.module';

@Module({
  controllers: [DefaultBusinessController],
  providers: [DefaultBusinessService],
  imports: [
    TypeOrmModule.forFeature([DefaultBusiness]),
    UserBusinessRoleModule,
  ],
  exports: [DefaultBusinessService],
})
export class DefaultBusinessModule {}
