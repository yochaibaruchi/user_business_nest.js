import { Column } from 'typeorm/decorator/columns/Column';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { CreateTagDto } from '../dto/create-tag.dto';
import { Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from 'src/business/entities/business.entity';
@Entity('business_tag')
@Index('text_business_tag_UNIQUE', ['text', 'business'], { unique: true })
export class BusinessTags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Business, (business) => business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'business_id' })
  public businessId: Number;

  static fromCreateTagDto(createTagDto: CreateTagDto) {
    const tag = new BusinessTags();
    tag.text = createTagDto.text;
    tag.businessId = createTagDto.businessId;
    return tag;
  }
}
