import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { BusinessTags } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(BusinessTags)
    private tagRepository: Repository<BusinessTags>,
  ) {}
  async create(createTagDto: CreateTagDto): Promise<BusinessTags> {
    try {
      const tag = BusinessTags.fromCreateTagDto(createTagDto);
      return await this.tagRepository.save(tag);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('this business have this type aleady');
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('no business entity found.');
      }
      throw new BadRequestException();
    }
  }

  findAll() {
    return `This action returns all tags`;
  }

  async findOne(tagText: string) {
    try {
      const tagWithBusinesses = await this.tagRepository.find({
        where: {
          text: tagText,
        },
        relations: {
          business: true,
        },
      });
      return tagWithBusinesses;
    } catch (error) {
      console.log(error);
    }
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
