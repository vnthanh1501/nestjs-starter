import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['id'])
export class Common {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @CreateDateColumn()
  createdDate: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedDate: Date;
}
