import { METADATA } from '@app/common/enums/metadata.enum';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { USER_ROLE } from './enum/role.enum';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Request } from 'express';
import {
  PaginationRequest,
  PaginationResult,
} from '@app/common/dto/Pagination.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
@SetMetadata(METADATA.ROLE, [
  USER_ROLE.NORMAL,
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
])
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async list(
    @Query() query: PaginationRequest<Category>,
  ): Promise<PaginationResult<Category>> {
    return await this.categoryService.list(query, null);
  }

  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Get(':ownerId')
  async listByOwnerId(
    @Query() query: PaginationRequest<Category>,
    @Param('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<PaginationResult<Category>> {
    return await this.categoryService.list(query, ownerId);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body() data: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.create(data, (request as any).user.id);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<User> {
  //   return await this.categoryService.findOneById(id);
  // }

  // @Put(':id')
  // async updateOne(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
  //   return await this.categoryService.update(id, userData);
  // }
}
