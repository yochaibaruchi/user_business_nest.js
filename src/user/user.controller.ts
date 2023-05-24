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
  InternalServerErrorException,
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
import { CognitoIdTokenDto } from './dto/syncSocialSignUps.dto';

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
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  //SWAGGER
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new BadRequestException(
          'An error occurred while fetching all users.',
        );
      }
    }
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
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  //SWAGGER
  async findOne(@Req() req: CognitoJwt): Promise<User> {
    try {
      return await this.userService.findByIdOrFail(req.user.sub);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(
          'An error occurred while fetching the user by id.',
        );
      }
    }
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
    try {
      const { UserSub } = await this.cognitoService.signUp(authRegisterUserDto);

      const params: CreateUserDto = {
        id: UserSub,
        email: authRegisterUserDto.email,
        name: authRegisterUserDto.name,
        phone_number: '',
      };

      return await this.userService.register(params);
    } catch (error) {
      console.error('Error during registration:', error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new BadRequestException(
          'An error occurred while registering the user.',
        );
      }
    }
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
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
    description: 'User with businesses and roles',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        fullName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        businessesWithRole: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              businessId: { type: 'number' },
              businessType: { type: 'string' },
              location: { type: 'string' },
              bankId: { type: 'number' },
              roleId: { type: 'number' },
              role: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request ' })
  async getUserWithBusinessesAndRoles(
    @Req() req: CognitoJwt,
  ): Promise<UserWithBusinessesResponse> {
    return this.userService.getUserWithBusinessesAndRoles(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Post('sync-social-signups')
  async syncSocialSignUps(
    @Body() cognitoIdTokenDto: CognitoIdTokenDto,
    @Req() req: CognitoJwt,
  ) {
    const user = await this.userService.findUserByIdOrNull(req.user.sub);
    if (!user) {
      const decodedToken = await this.cognitoService.decodeAndVerifyIdToken(
        cognitoIdTokenDto.token,
      );
      const params: CreateUserDto = {
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        phone_number: '',
        confirmEmail: true,
      };

      await this.userService.register(params);
    }
    return { message: 'User sync completed' };
  }
}
