
import { UserBusinessRole } from 'src/user-business-role/entities/user-business-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn({ name: 'business_id' })
  businessId: number;

  @Column({ name: 'business_type' })
  businessType: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'bank_id' })
  bankId: string;
  
  @OneToMany(() => UserBusinessRole, (userBusinessRole) => userBusinessRole.business)
  userBusinessRoles: UserBusinessRole[];

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}

