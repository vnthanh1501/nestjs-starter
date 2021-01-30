import { customThrowError } from '@app/common/helpers/throw.helper';
import { ResponseMessage } from '@app/common/langs/en';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { FindOneOptions, Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    if (userData.email && (await this.findOneByEmail(userData.email))) {
      customThrowError(ResponseMessage.EMAIL_EXISTED, HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.password = await bcrypt.hash(userData.password, 10);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: string | number): Promise<User> {
    let user: User;
    try {
      user = await this.userRepository.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
    if (!user) {
      customThrowError(ResponseMessage.NOT_EXIST_USER, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async update(id: string, updateUserData: UpdateUserDto): Promise<User> {
    let userToUpdate: User;

    // if (userData.email && await this.findOneByEmail(userData.email)) {
    //   throw new BadRequestException('E-Mail already exists', 'email_already_exists');
    // }

    try {
      userToUpdate = await this.userRepository.findOne(id);
    } catch (error) {
      throw new Error(error);
    }

    // check if email already exists in db
    if (
      updateUserData.email &&
      (await this.findOneByEmail(updateUserData.email))
    ) {
      customThrowError(ResponseMessage.EMAIL_EXISTED, HttpStatus.BAD_REQUEST);
    }

    // if request body includes oldPassword & newPassword
    if (updateUserData.oldPassword && updateUserData.newPassword) {
      const isOldPasswordCorrect = await bcrypt.compare(
        updateUserData.oldPassword,
        userToUpdate.password,
      );
      // if user provied wrong old password
      if (!isOldPasswordCorrect) {
        customThrowError(
          ResponseMessage.INCORRECT_OLD_PASSWORD,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // user provied correct old password
        userToUpdate.password = await bcrypt.hash(
          updateUserData.newPassword,
          10,
        );
      }
    } else if (
      (updateUserData.oldPassword && !updateUserData.newPassword) ||
      (!updateUserData.oldPassword && updateUserData.newPassword)
    ) {
      customThrowError(
        ResponseMessage.PASSWORD_REQUIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated = Object.assign(userToUpdate, updateUserData);
    return await this.userRepository.save(updated);
  }

  async getAuthInstance(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }
}
