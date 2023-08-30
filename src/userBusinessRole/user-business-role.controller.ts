import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserBusinessRoleService } from './user-business-role.service';
import { CreateUserBusinessRoleDto } from './dto/create-user-business-role.dto';
import { CognitoAuthGuard } from 'src/cognito/guards/cognito.jwt.guard';
import { CognitoJwt } from 'src/cognito/cognito.interfaces';

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
  create(
    @Body() createUserBusinessRoleDto: CreateUserBusinessRoleDto,
  ): Promise<number> {
    return this.userBusinessRoleService.create(createUserBusinessRoleDto);
  }
}
