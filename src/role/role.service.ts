import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRoleDto.name;
    try {
      const newRole = await this.roleRepository.save(role);
      return newRole;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Role with this name already exists.');
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find();
      if (!roles || roles.length === 0) {
        throw new NotFoundException('No roles found.');
      }
      return roles;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async findById(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ roleId: id });
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found.`);
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  //doto
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found.`);
    }

    role.name = updateRoleDto.name;

    try {
      const updatedRole = await this.roleRepository.save(role);
      return updatedRole;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Role with this name already exists.');
      }
      throw error;
    }
  }
  //doto?
  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
