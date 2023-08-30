import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { UserBusinessRole } from './entities/user-business-role.entity';
import { CreateUserBusinessRoleDto } from './dto/create-user-business-role.dto';
import { IsAdminDto } from './dto/isUserBusinessAdmin.dto';

@Injectable()
export class UserBusinessRoleService {
  constructor(
    @InjectRepository(UserBusinessRole)
    private readonly userBusinessRoleRepository: Repository<UserBusinessRole>,
  ) {}

  async create(
    createUserBusinessRoleDto: CreateUserBusinessRoleDto,
  ): Promise<number> {
    const { userId, businessId, roleId } = createUserBusinessRoleDto;
    try {
      const result = this.userBusinessRoleRepository
        .createQueryBuilder()
        .insert()
        .into(UserBusinessRole)
        .values({
          business: {
            businessId: businessId,
          },
          user: {
            id: userId,
          },
          role: {
            roleId: roleId,
          },
        })
        .execute();

      return (await result).raw.insertId;
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        const message = this.identifyMissingReference(
          error.message,
          createUserBusinessRoleDto,
        );
        throw new BadRequestException(message);
      }
      throw new BadRequestException(
        'Failed to create UserBusinessRole: ' + error.message,
      );
    }
  }

  findAll(): Promise<UserBusinessRole[]> {
    return this.userBusinessRoleRepository.find();
  }

  async isAdminUserForBusiness(isAdminDto: IsAdminDto): Promise<boolean> {
    try {
      const userBusinessRole = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusinessRole')
        .select('role.name', 'roleName')
        .innerJoin('userBusinessRole.user', 'user')
        .innerJoin('userBusinessRole.business', 'business')
        .innerJoin('userBusinessRole.role', 'role')
        .where('user.id = :userId', { userId: isAdminDto.userId })
        .andWhere('business.id = :businessId', {
          businessId: isAdminDto.businessId,
        })
        .getRawOne();

      return userBusinessRole.roleName === 'admin';
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('User or Business not found');
      }
      // default error handling
      throw new BadRequestException(error.message);
    }
  }

  private identifyMissingReference(
    errorMessage: string,
    createUserBusinessRoleDto: CreateUserBusinessRoleDto,
  ): string {
    if (errorMessage.includes('user_id')) {
      return `User with id ${createUserBusinessRoleDto.userId} not found.`;
    } else if (errorMessage.includes('business_id')) {
      return `Business with id ${createUserBusinessRoleDto.businessId} not found.`;
    } else if (errorMessage.includes('role_id')) {
      return `Role with id ${createUserBusinessRoleDto.roleId} not found.`;
    } else {
      return 'Missing referenced entity.';
    }
  }

  async CountUserBusinesses(userId: string) {
    return this.userBusinessRoleRepository
      .createQueryBuilder('user_business_role')
      .where('user_business_role.user_id = :user_id', { user_id: userId })
      .getCount();
  }
}
