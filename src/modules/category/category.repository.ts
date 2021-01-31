// import { Asset } from 'src/entities/asset/asset.entity';
// import { ASSET_REFERENCE_TYPE } from 'src/entities/asset/enums/assetReferenceType.enum';
import { EntityRepository, FindManyOptions, Repository } from 'typeorm';
import { Category } from './category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async list(
    options: FindManyOptions<Category>,
  ): Promise<[Category[], number]> {
    const { where, skip, take, order, withDeleted } = options;
    const query = await this.createQueryBuilder('c').where(where);
    //   .leftJoinAndMapOne(
    //     'c.image',
    //     Asset,
    //     'a',
    //     'a.referenceType = :type and a.referenceId = c.id',
    //     {
    //       type: ASSET_REFERENCE_TYPE.CATEGORY_IMG,
    //     },
    //   );

    const orderKeys = Object.keys(order || {});

    if (orderKeys.length) {
      query.orderBy(orderKeys[0], order[orderKeys[0]]);
    } else {
      query.orderBy('c.createdAt', 'DESC');
    }

    if (withDeleted) {
      query.withDeleted();
    }

    const categories = query
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return categories;
  }
}
