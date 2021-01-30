import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { METADATA } from './common/enums/metadata.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Intro')
  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Get()
  getHello(): any {
    return this.appService.getHello();
  }
}
