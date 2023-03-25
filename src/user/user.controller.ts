import { Controller, Get, Post, Body, ConflictException, InternalServerErrorException, Put, Param, ParseIntPipe, NotFoundException, BadRequestException, } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



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
        throw error;
      } else {
        throw new InternalServerErrorException('An error occurred while fetching all users.');
      }
    }
  }

  // GET by id.
  @Get(':id')
   //SWAGGER
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user with the given ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
   //SWAGGER
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An error occurred while fetching the user by id.');
      }
    }
  }


  //CREATE user rout 
  @Post()
  //SWAGGER
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 409, description: 'User with the same email already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
   //SWAGGER
  async create(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>>{
    try {
      return await this.userService.register(createUserDto);
    } catch (error) {
      console.error('Error during registration:', error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An error occurred while registering the user.');
      }
    }
  }



//UPDATE user rout and NOT change password 
  @Put(':id')
  //SWAGGER
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  //SWAGGER
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } if(error instanceof ConflictException){
        throw new ConflictException(error.message)
      }else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }


}