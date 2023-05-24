import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserBusinessRoleService } from './user-business-role.service';
import { CreateUserBusinessRoleDto } from './dto/create-user-business-role.dto';
import { UserBusinessRole } from './entities/user-business-role.entity';

@ApiTags('user-business-roles')
@Controller('user-business-roles')
export class UserBusinessRoleController {
  constructor(
    private readonly userBusinessRoleService: UserBusinessRoleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new User-Business-Role relationship' })
  @ApiResponse({
    status: 201,
    description:
      'The User-Business-Role relationship has been successfully created.',
    type: Number,
  })
  @ApiResponse({
    status: 404,
    description: 'User, Business, or Role not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to create the User-Business-Role relationship.',
  })
  create(
    @Body() createUserBusinessRoleDto: CreateUserBusinessRoleDto,
  ): Promise<number> {
    return this.userBusinessRoleService.create(createUserBusinessRoleDto);
  }
}
