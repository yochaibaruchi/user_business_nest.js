import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

import { validate } from 'class-validator';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch all users.');
    }
  }

  //find by id 
  async findById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to fetch user by id.');
      }
    }
  }
  

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password' |'refreshToken'>>  {
    

    const validationErrors = await validate(createUserDto);
    if (!validationErrors ) {
      throw new BadRequestException(validationErrors.map((error) => Object.values(error.constraints)).flat().join(', '));
    }
    
  
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.phone = createUserDto.phone;
    user.isAdmin = createUserDto.isAdmin;
    
  
    try {
      const newUser = await this.userRepository.save(user);
      const { password,refreshToken, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with this email already exists.');
      }
      throw error;
    }
  }
  

  //UPDATE user can update any part of the user but cant update the password.
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    //validate the updateUserDto object.
    const validationErrors = await validate(updateUserDto);
    if (!validationErrors ) {
      throw new BadRequestException(validationErrors.map((error) => Object.values(error.constraints)).flat().join(', '));
    }
    // Find the user by id.
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    // Update the user's properties.
    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.email = updateUserDto.email ?? user.email;
    user.phone = updateUserDto.phone ?? user.phone;
    user.isAdmin = updateUserDto.isAdmin ?? user.isAdmin;
  
    // Save the updated user to the database.
    try{
      const updatedUser = await this.userRepository.save(user);
      // Return the updated user without the password field.
      const { password,refreshToken, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }catch(error){
      console.log(error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with this email already exists.');
      }else{
        throw new InternalServerErrorException('Failed to update user.');
      }
    }
  
  }
  

 /**
   * Finds a user by their email address.
   *
   * @param email The user's email address.
   * @returns The user with the given email address, or undefined if no user is found.
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where : {email}  });
  }

  // Add more functions as needed
}