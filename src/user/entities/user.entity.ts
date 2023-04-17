import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { UserBusinessRole } from 'src/user-business-role/entities/user-business-role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({name : 'id'})
  id: number;

  @Column({ length: 255 ,name : 'first_name'})
  firstName: string;

  @Column({ length: 255, name: 'last_name' })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
 private normalizeEmail() {
    this.email = this.email.toLowerCase();
  }

  @Exclude({toPlainOnly: true})
  @Column({ length: 255 })
  @MinLength(8)
  password: string;

  @Column({ length: 255 })
  @MinLength(11)
  phone: string;

  @Column({ default: true , name: 'is_admin'})
  isAdmin: boolean;
 @Exclude({toPlainOnly: true})
  @Column({ default: null, type: 'varchar', length: 1024,name: 'refresh_token' })
  refreshToken: string;

  @CreateDateColumn({name : 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name : 'updated_at'})
  updatedAt: Date;


  @OneToMany(() => UserBusinessRole, (userBusinessRole) => userBusinessRole.user)
  userBusinessRoles: UserBusinessRole[];

 
  @BeforeInsert()
 private  async  hashPassword() :Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}