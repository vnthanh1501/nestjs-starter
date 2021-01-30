import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { USER_ROLE } from '@app/modules/user/enum/role.enum';
import { User } from '@app/modules/user/user.entity';
import { FindOneOptions, LessThanOrEqual } from 'typeorm';
import { METADATA } from '../enums/metadata.enum';
import { UserService } from '@app/modules/user/user.service';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class RoleAuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    private readonly userService: UserService, // @InjectRepository(UserRepository) // private readonly userRepository: UserRepository,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      METADATA.IS_PUBLIC,
      context.getHandler(),
    );

    const allowRoles = this.reflector.get<USER_ROLE[]>(
      METADATA.ROLE,
      context.getClass(),
    );

    if (isPublic) {
      return true;
    }

    const request = this._getRequest(context);
    return this._handleRequest(request, allowRoles);
  }

  private async _handleRequest(
    req: Request,
    allowRoles: USER_ROLE[],
  ): Promise<boolean> {
    const token = (req as any).user;

    if (!token) {
      return false;
    }

    const options: FindOneOptions<User> = {
      where: {
        email: token.email,
        // passwordChangedAt: LessThanOrEqual(new Date(token.iat * 1000)),
      },
      select: ['id', 'role', 'email'],
    };

    const user = await this.userService.getAuthInstance(options);

    if (!user) {
      return false;
    }

    if (!allowRoles.includes(user.role)) {
      return false;
    }

    (req as CustomRequest).authInstance = user;

    return true;
  }

  private _getRequest<T = any>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
}
