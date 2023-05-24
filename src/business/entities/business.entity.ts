import { Exclude } from 'class-transformer';
import { UserBusinessRole } from 'src/userBusinessRole/entities/user-business-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CreateBusinessDto } from '../dto/create-business.dto';

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
  userBusinessRoles: UserBusinessRole[];

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  static fromCreateBusinessDto(createBusinessDto: CreateBusinessDto): Business {
    const business = new Business();
    business.bankId = createBusinessDto.bankId;
    business.businessName = createBusinessDto.businessName;
    business.businessType = createBusinessDto.businessType;
    business.location = createBusinessDto.location;
    business.bankAccountId = createBusinessDto.bankAccountId;
    return business;
  }
}
