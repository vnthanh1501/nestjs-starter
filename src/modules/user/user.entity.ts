import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Common } from '@app/common/Common.entity';
import { USER_ROLE } from './enum/role.enum';

@Entity()
@Unique(['email'])
export class User extends Common {
  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({default: USER_ROLE.NORMAL})
  role: USER_ROLE;

  @Column({ select: false, nullable: true })
  passwordResetToken: string;

  @Column({ select: false, nullable: true })
  passwordResetExpires: Date;

  @Column({ nullable: true })
  deviceToken: string;
}
