import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationRequest<T> {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  take: number;

  @ApiPropertyOptional()
  @IsOptional()
  orderBy?: keyof T;

  @ApiPropertyOptional({ enum: SortDirection })
  @IsOptional()
  orderDirection?: SortDirection;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @Transform((x) => x === 'true')
  @IsOptional()
  isGettingDeleted?: boolean;
}

export class PaginationResult<T> {
  constructor(data: T[], count: number) {
    this.data = data;
    this.count = count;
  }

  data: T[];
  count: number;
}
