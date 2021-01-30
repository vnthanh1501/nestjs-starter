import * as bcrypt from 'bcryptjs';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@app/modules/user/user.entity';
import { UserService } from '@app/modules/user/user.service';
import { CreateUserDto } from '@app/modules/user/dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { customThrowError } from '@app/common/helpers/throw.helper';
import { TokenHelper } from '@app/common/helpers/token.helper';
import { ResponseMessage } from '@app/common/langs/en';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly tokenHelper: TokenHelper,
  ) { }

  async signUp(userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  // todo: return type
  async login(loginUserData: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginUserData.email);
    if (!user) {
      customThrowError(ResponseMessage.NOT_EXIST_USER, HttpStatus.UNAUTHORIZED);
    }
    // if user found
    if (user) {
      // compare password
      const isPasswordCorrect = await bcrypt.compare(loginUserData.password, user.password);
      // if password is correct
      if (isPasswordCorrect) {
        const accessToken = this.tokenHelper.createToken({
          id: user.id,
          email: user.email,
        });
        return {
          token: accessToken,
        };
      } else {  // if password is incorrect
        customThrowError(ResponseMessage.INCORRECT_PASSWORD, HttpStatus.BAD_REQUEST);
      }
    }
  }

  /**
   * Validates a user using JWT token payload.
   * @param payload JWT token payload.
   */
  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.findOneByEmail(payload.email);
  }

}
