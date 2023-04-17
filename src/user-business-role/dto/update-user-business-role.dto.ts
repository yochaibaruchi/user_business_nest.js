import { PartialType } from '@nestjs/swagger';
import { CreateUserBusinessRoleDto } from './create-user-business-role.dto';

export class UpdateUserBusinessRoleDto extends PartialType(CreateUserBusinessRoleDto) {}
