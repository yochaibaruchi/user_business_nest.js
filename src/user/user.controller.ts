import {
  Controller,
  Get,
  Post,
  Body,
  ConflictException,
  Put,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserWithBusinessesResponse } from './dto/user-with-businesses-response.interface';
import { CognitoAuthGuard } from 'src/cognito/guards/cognito.jwt.guard';
import { AuthRegisterUserDto } from 'src/cognito/dto/AuthRegisterUser.dto';
import { CognitoService } from 'src/cognito/cognito.service';
import { UpdateUserAttributesDto } from 'src/cognito/dto/updateUserAttributes.dto';
import { CognitoJwt } from 'src/cognito/cognito.interfaces';
import { UserBusinessRoleIdsDto } from './dto/userBusinessRolesList.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cognitoService: CognitoService,
  ) {}

  // auth
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  //GET all.
  @Get()
  //SWAGGER
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns an array of users.' })
  @ApiResponse({
    status: 400,
    description: 'An error occurred while fetching all users.',
  })
  //SWAGGER
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Get('id')
  //SWAGGER
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  //SWAGGER
  async findOne(@Req() req: CognitoJwt): Promise<User> {
    return await this.userService.findByIdOrFail(req.user.sub);
  }

  //CREATE user rout
  @Post()
  //SWAGGER
  @ApiBody({ type: AuthRegisterUserDto })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'User with the same email already exists',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  //SWAGGER
  async create(
    @Body() authRegisterUserDto: AuthRegisterUserDto,
  ): Promise<User> {
    const { UserSub } = await this.cognitoService.signUp(authRegisterUserDto);

    const params: CreateUserDto = {
      id: UserSub,
      email: authRegisterUserDto.email,
      name: authRegisterUserDto.name,
      phone_number: '',
    };

    return await this.userService.register(params);
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  //UPDATE user rout and NOT change password
  @Put()
  //SWAGGER
  @ApiBody({ type: UpdateUserAttributesDto })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  //SWAGGER
  async updateUser(
    @Req() req: CognitoJwt,
    @Body() updateUserAttributesDto: UpdateUserAttributesDto,
  ): Promise<User> {
    try {
      //cognito
      await this.cognitoService.updateUserAttributes(
        req.user.sub,
        updateUserAttributesDto,
      );
      //mySQL
      const updatedUser = await this.userService.updateUser(
        req.user.sub,
        updateUserAttributesDto,
      );
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new BadRequestException('Bad Request');
      }
    }
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Get(':id/businesses')
  @ApiOperation({ summary: 'Get user with businesses and roles' })
  @ApiResponse({
    status: 200,
    description: 'User with businesses and roles ids',
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          role_name: {
            type: 'string',
            example: 'admin',
          },
          name: {
            type: 'string',
            example: 'the shit show',
          },
          id: {
            type: 'number',
            example: 8,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request ' })
  async getUserWithBusinessesAndRoles(
    @Req() req: CognitoJwt,
  ): Promise<UserBusinessRoleIdsDto[]> {
    return this.userService.getUserBusinessesAndRoleIds(req.user.sub);
  }
}
