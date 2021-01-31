import {
  PaginationRequest,
  PaginationResult,
} from '@app/common/dto/Pagination.dto';
import { customThrowError } from '@app/common/helpers/throw.helper';
import { ResponseMessage } from '@app/common/langs/en';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(data: CreateCategoryDto, ownerId: number): Promise<Category> {
    // if (categoryData.email && (await this.findOneByEmail(categoryData.email))) {
    //   customThrowError(ResponseMessage.EMAIL_EXISTED, HttpStatus.BAD_REQUEST);
    // }

    const category = new Category();
    category.ownerId = ownerId;
    category.name = data.name;
    category.description = data.description;

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async list(
    query: PaginationRequest<Category>,
    ownerId: number
  ): Promise<PaginationResult<Category>> {
    const { skip, take, search, orderBy, orderDirection } = query;

    const options: FindManyOptions<Category> = {
      skip,
      take,
    };

    options.where = {};
    if (ownerId) {
      options.where = {
        ownerId,
      };
    }

    if (search) {
      options.where = {
        ...options.where,
        name: Raw(alias => `LOWER(${alias}) like '%${search.toLowerCase()}%'`),
      };
    }

    if (orderBy) {
      options.order = {
        [orderBy]: orderDirection,
      };
    }

    const [data, count] = await this.categoryRepository.list(options);

    return new PaginationResult<Category>(
      // data.map(d => new Category(d)),
      data,
      count,
    );
  }

  // async update(id: string, updateUserData: UpdateUserDto): Promise<Category> {
  //   let categoryToUpdate: Category;

  //   try {
  //     categoryToUpdate = await this.categoryRepository.findOne(id);
  //   } catch (error) {
  //     throw new Error(error);
  //   }

  //   // check if email already exists in db
  //   if (
  //     updateUserData.email &&
  //     (await this.findOneByEmail(updateUserData.email))
  //   ) {
  //     customThrowError(ResponseMessage.EMAIL_EXISTED, HttpStatus.BAD_REQUEST);
  //   }

  //   // if request body includes oldPassword & newPassword
  //   if (updateUserData.oldPassword && updateUserData.newPassword) {
  //     const isOldPasswordCorrect = await bcrypt.compare(
  //       updateUserData.oldPassword,
  //       categoryToUpdate.password,
  //     );
  //     // if category provied wrong old password
  //     if (!isOldPasswordCorrect) {
  //       customThrowError(
  //         ResponseMessage.INCORRECT_OLD_PASSWORD,
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     } else {
  //       // category provied correct old password
  //       categoryToUpdate.password = await bcrypt.hash(
  //         updateUserData.newPassword,
  //         10,
  //       );
  //     }
  //   } else if (
  //     (updateUserData.oldPassword && !updateUserData.newPassword) ||
  //     (!updateUserData.oldPassword && updateUserData.newPassword)
  //   ) {
  //     customThrowError(
  //       ResponseMessage.PASSWORD_REQUIRED,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const updated = Object.assign(categoryToUpdate, updateUserData);
  //   return await this.categoryRepository.save(updated);
  // }
}
