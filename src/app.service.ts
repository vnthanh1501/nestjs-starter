import { Injectable } from '@nestjs/common';
import { Info } from './common/langs/en';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      author: Info.AUTHOR,
      message: Info.MESSAGE,
    };
  }
}
