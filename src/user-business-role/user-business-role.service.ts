import { Injectable } from '@nestjs/common';
import { CreateUserBusinessRoleDto } from './dto/create-user-business-role.dto';
import { UpdateUserBusinessRoleDto } from './dto/update-user-business-role.dto';

@Injectable()
export class UserBusinessRoleService {
  create(createUserBusinessRoleDto: CreateUserBusinessRoleDto) {
    return 'This action adds a new userBusinessRole';
  }

  findAll() {
    return `This action returns all userBusinessRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userBusinessRole`;
  }

  update(id: number, updateUserBusinessRoleDto: UpdateUserBusinessRoleDto) {
    return `This action updates a #${id} userBusinessRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBusinessRole`;
  }
}
