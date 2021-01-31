import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Common } from '@app/common/Common.entity';

@Entity()
export class Category extends Common {
  @ApiProperty()
  @Column()
  ownerId: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;
}
