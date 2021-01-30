import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getTokenFromRequest } from '@app/common/utils/request.util';
import { TokenHelper } from '../helpers/token.helper';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(private readonly tokenHelper: TokenHelper) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tokenString = getTokenFromRequest(req);

    if (!tokenString) return next();
    const token = await this.tokenHelper.verifyToken(tokenString);

    (req as any).user = token;

    next();
  }
}
