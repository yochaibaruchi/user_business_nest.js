import { PartialType } from '@nestjs/swagger';
import { CreateUserBusinessRoleDto } from './create-user-business-role.dto';

export class UpdateRoleDto extends PartialType(CreateUserBusinessRoleDto) {}
