import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ASSET_REFERENCE_TYPE } from './enums/asset-reference-type.enum';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    enum: ASSET_REFERENCE_TYPE,
    default: ASSET_REFERENCE_TYPE.USER_IMG,
  })
  referenceType: ASSET_REFERENCE_TYPE;

  @Column()
  referenceId: number;

  @Column({
    nullable: true,
  })
  fileName: string;

  @Column({
    nullable: true,
  })
  extension: string;

  @Column({
    default: true,
  })
  isActive: boolean;
}
