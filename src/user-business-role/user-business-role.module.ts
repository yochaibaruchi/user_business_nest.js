import { Module } from '@nestjs/common';
import { UserBusinessRoleService } from './user-business-role.service';
import { UserBusinessRoleController } from './user-business-role.controller';

@Module({
  controllers: [UserBusinessRoleController],
  providers: [UserBusinessRoleService]
})
export class UserBusinessRoleModule {}
