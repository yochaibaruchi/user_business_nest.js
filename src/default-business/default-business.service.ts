import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDefaultBusinessDto } from './dto/create-default-business.dto';
import { UpdateDefaultBusinessDto } from './dto/update-default-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultBusiness } from './entities/default-business.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DefaultBusinessService {
  constructor(
    @InjectRepository(DefaultBusiness)
    private defaultBusinessRepository: Repository<DefaultBusiness>,
  ) {}
  create(createDefaultBusinessDto: CreateDefaultBusinessDto) {
    try {
      this.defaultBusinessRepository
        .createQueryBuilder('DashboardService')
        .insert()
        .into(DefaultBusiness)
        .values({
          business: { businessId: createDefaultBusinessDto.businessId },
          user: { id: createDefaultBusinessDto.userId },
        })
        .execute();
    } catch (error: any) {
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          throw new ConflictException();
        case 'ER_NO_REFERENCED_ROW_2':
          throw new NotFoundException('Business or user are not found');
        default:
          throw new BadRequestException();
      }
    }
  }

  async update(
    userId: string,
    updateDefaultBusinessDto: UpdateDefaultBusinessDto,
  ): Promise<number> {
    try {
      const defaultBusiness = this.defaultBusinessRepository.save({
        user: {
          id: userId,
        },
        business: {
          businessId: updateDefaultBusinessDto.businessId,
        },
      });

      return (await defaultBusiness).businessId;
    } catch (error: any) {
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          throw new ConflictException();
        case 'ER_NO_REFERENCED_ROW_2':
          throw new BadRequestException(
            'user or business do not exist in our system.',
          );
        default:
          throw new BadRequestException();
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} defaultBusiness`;
  }
}
