import { customThrowError } from '@app/common/helpers/throw.helper';
import { ResponseMessage } from '@app/common/langs/en';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
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

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOneById(id: string | number): Promise<Category> {
    let category: Category;
    try {
      category = await this.categoryRepository.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
    if (!category) {
      customThrowError(ResponseMessage.NOT_EXIST_USER, HttpStatus.NOT_FOUND);
    }
    return category;
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
