import { Business } from 'src/business/entities/business.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


@Entity({ name: 'user_business_role' })
export class UserBusinessRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userBusinessRoles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.userBusinessRoles, { nullable: false })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Role,(role)=> role.userBusinessRoles,{ nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}