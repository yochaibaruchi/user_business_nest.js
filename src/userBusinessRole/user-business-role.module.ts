import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBusinessRole } from './entities/user-business-role.entity';
import { UserBusinessRoleController } from './user-business-role.controller';
import { UserBusinessRoleService } from './user-business-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBusinessRole])],
  controllers: [UserBusinessRoleController],
  providers: [UserBusinessRoleService],
  exports: [UserBusinessRoleService],
})
export class UserBusinessRoleModule {}
