import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBusinessRoleService } from 'src/userBusinessRole/user-business-role.service';
import { CreateUserBusinessRoleDto } from 'src/userBusinessRole/dto/create-user-business-role.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private readonly userBusinessRole: UserBusinessRoleService,
  ) {}
  /**
   * Create a new business.
   * @param createBusinessDto The DTO containing the business data.
   * @param userId The ID of the user associated with the business.
   * @returns The created business.
   * @throws ConflictException if a business with the same bank account already exists.
   * @throws Error if there is an error during the creation process.
   */
  async create(
    createBusinessDto: CreateBusinessDto,
    userId: string,
  ): Promise<Business> {
    const business = Business.fromCreateBusinessDto(createBusinessDto);
    try {
      const newBusiness = await this.businessRepository.save(business);
      // connection between the business, user and admin role.

      const userBusinessRoleObj: CreateUserBusinessRoleDto = {
        userId: userId,
        roleId: 1,
        businessId: newBusiness.businessId,
      };

      await this.userBusinessRole.create(userBusinessRoleObj);

      return newBusiness;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Business with this bank account already exists.',
        );
      }
      throw new BadRequestException(error.message);
    }
  }
  /**
   * Get all businesses.
   * @returns An array of businesses.
   * @throws NotFoundException if no businesses are found.
   * @throws BadRequestException if there is an error during the fetch process.
   */
  async findAll(): Promise<Business[]> {
    try {
      const businesses = await this.businessRepository.find();
      if (!businesses || businesses.length === 0) {
        throw new NotFoundException('No businesses found.');
      }
      return businesses;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Failed to fetch all businesses.');
      }
    }
  }
  /**
   * Find a business by ID.
   * @param id The ID of the business.
   * @returns The found business.
   * @throws NotFoundException if the business is not found.
   * @throws BadRequestException if there is an error during the fetch process.
   */
  async findById(id: number): Promise<Business> {
    try {
      const Business = await this.businessRepository.findOneBy({
        businessId: id,
      });
      if (!Business) {
        throw new NotFoundException(`Business with id ${id} not found.`);
      }
      return Business;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException('Failed to fetch Business by id.');
      }
    }
  }
  /**
   * Update a business.
   * @param id The ID of the business to update.
   * @param updateBusinessDto The DTO containing the updated business data.
   * @returns The updated business.
   * @throws NotFoundException if the business is not found.
   * @throws ConflictException if a business with the same bank account already exists.
   * @throws BadRequestException if there is an error during the update process.
   */
  async update(
    id: number,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.findById(id);

    if (!business) {
      throw new NotFoundException('Business not found');
    }
    business.bankId = updateBusinessDto.bankId || business.bankId;
    business.businessType =
      updateBusinessDto.businessType || business.businessType;
    business.location = updateBusinessDto.location || business.location;
    business.bankAccountId =
      updateBusinessDto.bankAccountId || business.bankAccountId;
    business.businessName =
      updateBusinessDto.businessName || business.businessName;
    try {
      const updatedBusiness = await this.businessRepository.save(business);
      return updatedBusiness;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Business with this bank account already exists.',
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
