import { Business } from 'src/business/entities/business.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
@Index('user_business_default_UNIQUE', ['user', 'business'], { unique: true })
@Entity({ name: 'default_business' })
export class DefaultBusiness {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.defaultBusiness)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.defaultBusiness)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'business_id' })
  businessId: number;
}
