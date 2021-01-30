import * as mimeTypes from 'mime-types';
import { EntityRepository, Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { ASSET_REFERENCE_TYPE } from './enums/asset-reference-type.enum';

@EntityRepository(Asset)
export class AssetRepository extends Repository<Asset> {
  async saveAsset(
    file: Express.Multer.File,
    type: ASSET_REFERENCE_TYPE,
    refId: number,
  ): Promise<boolean> {
    const newFile = new Asset();
    const extension = mimeTypes.extension(file.mimetype);

    let fileName = '';
    if (file.originalname) {
      fileName = file.originalname;
    }
    newFile.fileName = fileName;
    newFile.id = file.filename.split('.')[0];
    newFile.referenceType = type;
    newFile.referenceId = refId;
    newFile.extension = extension;

    await this.save(newFile);
    return true;
  }
}
