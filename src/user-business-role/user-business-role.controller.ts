import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserBusinessRoleService } from './user-business-role.service';
import { CreateUserBusinessRoleDto } from './dto/create-user-business-role.dto';
import { UpdateUserBusinessRoleDto } from './dto/update-user-business-role.dto';

@Controller('user-business-role')
export class UserBusinessRoleController {
  constructor(private readonly userBusinessRoleService: UserBusinessRoleService) {}

  @Post()
  create(@Body() createUserBusinessRoleDto: CreateUserBusinessRoleDto) {
    return this.userBusinessRoleService.create(createUserBusinessRoleDto);
  }

  @Get()
  findAll() {
    return this.userBusinessRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBusinessRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserBusinessRoleDto: UpdateUserBusinessRoleDto) {
    return this.userBusinessRoleService.update(+id, updateUserBusinessRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBusinessRoleService.remove(+id);
  }
}
