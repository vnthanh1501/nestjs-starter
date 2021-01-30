import { Controller, Get, Post, Body, SetMetadata, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/modules/user/dto';
import { User } from '@app/modules/user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { METADATA } from '@app/common/enums/metadata.enum';
import { USER_ROLE } from '../user/enum/role.enum';

@ApiTags('Auth')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@SetMetadata(METADATA.ROLE, [
  USER_ROLE.NORMAL,
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
])
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Post('signup') 
  async signUp(@Body() userData: CreateUserDto): Promise<User> {
    return await this.authService.signUp(userData);
  }

  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Get('protected')
  async protected() {
    return 'hello protected';
  }
}
