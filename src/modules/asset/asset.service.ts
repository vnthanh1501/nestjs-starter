import { customThrowError } from '@app/common/helpers/throw.helper';
import { ResponseMessage } from '@app/common/langs/en';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import * as path from 'path';
import { AssetRepository } from './asset.repository';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}
  async retrieve(name: string, res: Response) {
    if (!existsSync(path.join('./uploads', name))) {
      customThrowError(ResponseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return res.sendFile(name, { root: './uploads' });
  }

  async delete(id: string): Promise<boolean> {
    await this.assetRepository.delete(id);
    return true;
  }
}
