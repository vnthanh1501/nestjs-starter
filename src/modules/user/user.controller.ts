import { METADATA } from '@app/common/enums/metadata.enum';
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_ROLE } from './enum/role.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@SetMetadata(METADATA.ROLE, [
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
])
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, userData);
  }

}
