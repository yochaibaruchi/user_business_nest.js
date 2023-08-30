import { Exclude } from 'class-transformer';
import { UserBusinessRole } from 'src/userBusinessRole/entities/user-business-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { BusinessTags } from 'src/tags/entities/tag.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { DefaultBusiness } from 'src/default-business/entities/default-business.entity';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn({ name: 'id' })
  businessId: number;

  @Column({ name: 'name' })
  businessName: string;

  @Column({ name: 'business_type' })
  businessType: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'bank_account_id', unique: true })
  @Exclude({ toPlainOnly: true })
  bankAccountId: string;

  @Column({ name: 'bank_id' })
  bankId: number;
  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.business,
  )
  @JoinColumn({ name: 'id' })
  userBusinessRoles: UserBusinessRole[];

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @OneToMany(() => BusinessTags, (businessTags) => businessTags.business, {
    cascade: true,
  })
  tags: BusinessTags[];

  static fromCreateBusinessDto(createBusinessDto: CreateBusinessDto): Business {
    const business = new Business();
    business.bankId = createBusinessDto.bankId;
    business.businessName = createBusinessDto.businessName;
    business.businessType = createBusinessDto.businessType;
    business.location = createBusinessDto.location;
    business.bankAccountId = createBusinessDto.bankAccountId;
    return business;
  }

  @OneToMany(() => Invoice, (invoice) => invoice.business)
  @JoinColumn({ name: 'id' })
  invoices: Invoice[];

  @OneToMany(
    () => DefaultBusiness,
    (defaultBusiness) => defaultBusiness.business,
  )
  @JoinColumn({ name: 'id' })
  defaultBusiness: DefaultBusiness[];
}
