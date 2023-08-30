import { Business } from 'src/business/entities/business.entity';
import { DefaultBusiness } from 'src/default-business/entities/default-business.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'user_business_role' })
export class UserBusinessRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userBusinessRoles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  public userId: Number;

  @ManyToOne(() => Business, (business) => business.userBusinessRoles, {
    nullable: false,
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'business_id' })
  public businessId: Number;

  @ManyToOne(() => Role, (role) => role.userBusinessRoles, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id' })
  public roleId: Number;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
