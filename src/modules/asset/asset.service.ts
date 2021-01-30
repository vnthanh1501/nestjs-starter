import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import * as path from 'path';
import { customThrowError } from 'src/common/helpers/throw.helper';
import { AssetRepository } from 'src/common/repositories/asset.repository';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}
  async retrieve(name: string, res: Response) {
    if (!existsSync(path.join('./uploads', name))) {
      customThrowError('Not found!', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(name, { root: './uploads' });
  }

  async delete(id: string): Promise<boolean> {
    await this.assetRepository.delete(id);
    return true;
  }
}
