import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithBusinessesResponse } from './dto/user-with-businesses-response.interface';
import { UpdateUserAttributesDto } from 'src/cognito/dto/updateUserAttributes.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  /**
   * Find all users.
   * @returns A Promise that resolves to an array of User objects.
   * @throws BadRequestException if there is an error during the process.
   */
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new BadRequestException('Failed to fetch all users.');
    }
  }

  /**
   * Find a user by ID or throw an exception if not found.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the User object if found.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if there is an error during the process.
   */
  async findByIdOrFail(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  /**
   * Register a new user.
   * @param createUserDto The DTO containing the details for the new user.
   * @returns A Promise that resolves to the newly created User object.
   * @throws ConflictException if the email is already in use by another user.
   * @throws BadRequestException if there is an error during the process.
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = User.fromCreateUserDto(createUserDto);
    console.log(user);

    try {
      const newUser = await this.userRepository.save(user);

      return newUser;
    } catch (error) {
      console.log(error);

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with this email already exists.');
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update a user's attributes in the database except password.
   * @param id The ID of the user.
   * @param updateUserAttributesDto The DTO containing the new attributes for the user.
   * @returns A Promise that resolves to the updated User object.
   * @throws NotFoundException if the user is not found.
   * @throws ConflictException if the email is already in use by another user.
   * @throws BadRequestException if there is an error during the process.
   */
  async updateUser(
    id: string,
    updateUserAttributesDto: UpdateUserAttributesDto,
  ): Promise<User> {
    console.log(id + 'service');

    // Find the user by id.
    const user = await this.findUserByIdOrNull(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    // Update the user's properties.
    user.name = updateUserAttributesDto.name ?? user.name;

    user.email = updateUserAttributesDto.email ?? user.email;
    user.phone_number =
      updateUserAttributesDto.phone_number ?? user.phone_number;

    // Save the updated user to the database.
    try {
      const updatedUser = await this.userRepository.save(user);
      // Return the updated user without the password field.

      return updatedUser;
    } catch (error) {
      console.log(error);

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with this email already exists.');
      } else {
        throw new BadRequestException(error.message);
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
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Fetch a user along with their associated businesses and roles.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to a UserWithBusinessesResponse object,
   * containing the user details along with their associated businesses and roles.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if there is an error during the process.
   */
  async getUserWithBusinessesAndRoles(
    userId: string,
  ): Promise<UserWithBusinessesResponse> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.Name', 'user.email', 'user.phone_number'])
        .leftJoinAndSelect('user.userBusinessRoles', 'userBusinessRoles')
        .leftJoinAndSelect('userBusinessRoles.business', 'business')
        .leftJoinAndSelect('userBusinessRoles.role', 'role')
        .where('user.id = :userId', { userId })
        .getOneOrFail();

      // Map the user entity to the UserWithBusinessesResponse object
      const response: UserWithBusinessesResponse = {
        id: user.id,
        fullName: user.name,
        email: user.email,
        phone: user.phone_number,
        businessesWithRole: user.userBusinessRoles.map((userBusinessRole) => ({
          businessId: userBusinessRole.business.businessId,
          businessType: userBusinessRole.business.businessType,
          location: userBusinessRole.business.location,
          bankId: userBusinessRole.business.bankId,
          roleId: userBusinessRole.role.roleId,
          role: userBusinessRole.role.name,
        })),
      };

      return response;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  /**
   * Find a user by email and confirm their email.
   * @param email The email of the user.
   * @returns Promise<void>
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if there is an error during the process.
   */
  async confirmUserEmail(email: string): Promise<void> {
    try {
      const result = await this.userRepository.update(
        { email },
        { confirmEmail: true },
      );

      // If no records were updated, it means that the user was not found
      if (result.affected === 0) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
    } catch (error) {
      // You can create custom exceptions or use built-in NestJS exceptions
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
  /**
   * Find a user by ID.
   * @param userId The ID of the user.
   * @returns The found user or null if not found.
   */
  async findUserByIdOrNull(userId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: userId });
  }
}
