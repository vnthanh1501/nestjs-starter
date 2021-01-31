import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { TOKEN_TYPE } from '@app/common/enums/token.enum';
import { customThrowError } from './throw.helper';
import { ResponseMessage } from '../langs/en';

@Injectable()
export class TokenHelper {
  secret = '';

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get('JWT_SECRET');
  }

  createToken(data: Record<string, unknown>): any {
    try {
      const token = jwt.sign(
        { ...data, 
          iat: Math.floor(Date.now() / 1000),
          type: TOKEN_TYPE.LOGIN
        },
        this.secret,
      );
      return token;
    } catch (error) {
      console.log(error)
      customThrowError(ResponseMessage.INVALID_CREDENTIAL, HttpStatus.UNAUTHORIZED);
    }
  }

  verifyToken(token: string, type: string = TOKEN_TYPE.LOGIN): any {
    try {
      const data: any = jwt.verify(token, this.secret);
      if (data.type === type) return data;
      customThrowError(ResponseMessage.INVALID_CREDENTIAL, HttpStatus.UNAUTHORIZED);
    } catch (error) {
      console.log(error)
      customThrowError(ResponseMessage.INVALID_CREDENTIAL, HttpStatus.UNAUTHORIZED);
    }
  }
}
