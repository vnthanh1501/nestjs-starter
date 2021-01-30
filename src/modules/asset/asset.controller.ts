import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Res,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AssetService } from './asset.service';
import { METADATA } from '@app/common/enums/metadata.enum';

@ApiTags('Asset')
@ApiBearerAuth()
@Controller('assets')
@UseInterceptors(ClassSerializerInterceptor)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get(':name')
  @SetMetadata(METADATA.IS_PUBLIC, true)
  retrieve(@Param('name') name: string, @Res() res: Response): Promise<any> {
    return this.assetService.retrieve(name, res);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.assetService.delete(id);
  }
}
