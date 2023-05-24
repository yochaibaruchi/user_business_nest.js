import { UserBusinessRole } from 'src/userBusinessRole/entities/user-business-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id' })
  roleId: number;

  @Column({ name: 'name', unique: true })
  name: string;

  @OneToMany(
    () => UserBusinessRole,
    (userBusinessRole) => userBusinessRole.business,
  )
  userBusinessRoles: UserBusinessRole[];
}
