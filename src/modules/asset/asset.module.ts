import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetRepository])],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
