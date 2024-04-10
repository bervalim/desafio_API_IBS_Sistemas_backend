import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  zipCode: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  address: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  complement: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  neighborhood: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  state: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;
}
