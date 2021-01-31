import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

  @ApiProperty()
  @Length(1)
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  // // todo: custom web3 eth address validator
  // @ApiProperty()
  // @IsNotEmpty()
  // @Length(42, 42)
  // readonly ethWalletAddress: string;
}
