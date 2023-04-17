import { UserBusinessRole } from "src/user-business-role/entities/user-business-role.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  
  @Column({ name: 'name' })
  name: string;

 @OneToMany(() => UserBusinessRole, (userBusinessRole) => userBusinessRole.business)
  userBusinessRoles: UserBusinessRole[];
}
