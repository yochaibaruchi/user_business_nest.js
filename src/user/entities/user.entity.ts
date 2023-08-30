import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
import { MinLength } from 'class-validator';
import { UserBusinessRole } from '../../userBusinessRole/entities/user-business-role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { DefaultBusiness } from 'src/default-business/entities/default-business.entity';
@Entity('user')
export class User {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ length: 255, name: 'full_name' })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  private normalizeEmail() {
    this.email = this.email.toLowerCase();
  }

  @Column({ length: 255, nullable: true })
  @MinLength(11)
  phone_number: string;

  @Column({ default: false })
  confirmEmail: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.user,
  )
  userBusinessRoles: UserBusinessRole[];

  // gets the full name and saves it as first and last.
  static fromCreateUserDto(createUserDto: CreateUserDto): User {
    const user = new User();

    // Split the full name into first and last names
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.phone_number = createUserDto.phone_number;
    user.id = createUserDto.id;
    user.confirmEmail = createUserDto.confirmEmail || false;
    return user;
  }

  @OneToOne(() => DefaultBusiness, (defaultbusiness) => defaultbusiness.user)
  defaultBusiness: DefaultBusiness;
}
